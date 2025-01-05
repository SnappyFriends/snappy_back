import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { BadRequestException, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages/messages.service';
import { GroupMembersService } from './chat-groups/group-members/group-members.service';
import { CreateMessageDto } from './messages/dto/create-message.dto';
import { UsersOnlineService, UsersService } from './users/users.service';
import {
  NotificationType,
  NotificationStatus,
} from './notifications/entities/notification.entity';
import { NotificationsService } from './notifications/notifications.service';

dotenv.config({ path: './.env' });

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: `${process.env.DOMAIN_FRONT}`,
    credentials: true,
  },
  transports: ['websocket'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger(ChatGateway.name);

  constructor(
    private jwtService: JwtService,
    private groupMemberService: GroupMembersService,
    private messageService: MessagesService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private usersOnlineService: UsersOnlineService,
  ) {
    console.log('ChatGateway constructor');
  }

  afterInit() {
    this.logger.log('🚀 Socket Server Initialized');
  }

  async handleConnection(client: Socket) {
    console.log('🟢 Cliente conectado:', client.id);
    console.log('Headers:', client.handshake.headers);

    const token = client.handshake.query.token;

    if (!token) {
      this.logger.warn('Cookie "auth_token" no proporcionada');
      client.emit('error', 'Cookie "auth_token" no proporcionada');
      client.disconnect();
      return;
    }

    try {
      const decoded = this.jwtService.verify(token as string);

      client.join(decoded.id);
      this.usersOnlineService.addUser(client.id, decoded);
      console.log(`Usuario ${decoded.id} unido a su sala personal`);

      const userGroups = await this.groupMemberService.findGroupsByUserId(
        decoded.id,
      );
      if (userGroups && userGroups.length > 0) {
        userGroups.forEach((group) => {
          client.join(group.id);
          console.log(`Usuario ${decoded.id} unido al grupo ${group.id}`);
        });
      }

      const user = await this.usersService.getUserById(decoded.sub);
      if (!user) {
        client.emit('error', 'Usuario no encontrado');
        client.disconnect();
        return;
      }

      this.logger.log(`User connected: ${client.id}`);
    } catch (error) {
      this.logger.error('Token inválido o expirado', error.message);
      client.emit('error', 'Token inválido o expirado');
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('🔴 Cliente desconectado:', client.id);
    this.usersOnlineService.removeUser(client.id);
  }

  @SubscribeMessage('message')
  async handleNewMessage(
    @MessageBody() payload: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('Datos recibidos en el Gateway:', payload);

      if (!payload.chatId && !payload.groupId) {
        throw new BadRequestException('Debe especificar un chatId o groupId');
      }

      const message = await this.messageService.createMessage(payload);

      if (payload.groupId) {
        console.log(`Emitiendo mensaje al grupo ${payload.groupId}`);
        this.server.to(payload.groupId).emit('receiveGroupMessage', message);
      } else if (payload.chatId) {
        console.log(
          `Emitiendo mensaje privado a los receptores: ${payload.messageReceivers}`,
        );

        payload.messageReceivers.forEach((receiverId) => {
          console.log(`Emitiendo mensaje a ${receiverId}`);
          this.server.to(receiverId).emit('receivePrivateMessage', message);

          this.notificationsService
            .create({
              content: 'Nuevo mensaje privado',
              type: NotificationType.MESSAGE,
              user_id: receiverId,
            })
            .then((notification) => {
              console.log(`Notificación enviada a ${receiverId}`);
              this.server.to(receiverId).emit('messageNotification', {
                notification,
                message,
              });
            });
        });
      }
    } catch (error) {
      console.error('Error al manejar el mensaje:', error.message);
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('join_chat')
  handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Cliente ${client.id} se unió a la sala ${chatId}`);
    client.join(chatId);
  }

  @SubscribeMessage('notification')
  async handleNotification(
    @MessageBody()
    payload: {
      type: NotificationType;
      content: string;
      userId: string;
      friendRequestId?: string;
      messageId?: string;
      postId?: string;
      commentId?: string;
      groupId?: string;
      purchaseId?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('📨 Notificación recibida:', payload);

    try {
      const notification = {
        content: payload.content,
        type: payload.type,
        user_id: payload.userId,
        status: NotificationStatus.UNREAD,
      };

      const savedNotification =
        await this.notificationsService.create(notification);

      switch (payload.type) {
        case NotificationType.FRIEND_REQUEST:
          this.server.to(payload.userId).emit('friendRequestNotification', {
            ...savedNotification,
            friendRequestId: payload.friendRequestId,
          });
          break;

        case NotificationType.MESSAGE:
          this.server.to(payload.userId).emit('messageNotification', {
            ...savedNotification,
            messageId: payload.messageId,
          });
          break;

        case NotificationType.POST_REACTION:
          this.server.to(payload.userId).emit('postReactionNotification', {
            ...savedNotification,
            postId: payload.postId,
          });
          break;

        case NotificationType.COMMENT:
          this.server.to(payload.userId).emit('commentNotification', {
            ...savedNotification,
            commentId: payload.commentId,
          });
          break;

        case NotificationType.GROUP_INVITATION:
          this.server.to(payload.userId).emit('groupInvitationNotification', {
            ...savedNotification,
            groupId: payload.groupId,
          });
          break;

        case NotificationType.PURCHASE:
          this.server.to(payload.userId).emit('purchaseNotification', {
            ...savedNotification,
            purchaseId: payload.purchaseId,
          });
          break;

        case NotificationType.SYSTEM:
          this.server
            .to(payload.userId)
            .emit('systemNotification', savedNotification);
          break;
      }
    } catch (error) {
      console.error('Error al manejar la notificación:', error.message);
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('getConnectedUsers')
  handleGetConnectedUsers(@ConnectedSocket() client: Socket) {
    const onlineUsers = this.usersOnlineService.getAllUsers();

    // Opcional: enviar la lista solo al cliente solicitante
    client.emit('onlineUsers', onlineUsers);

    // Si quieres emitir a todos los clientes, usa:
    this.server.emit('onlineUsers', onlineUsers);

    return onlineUsers; // Devuelve los usuarios si lo necesitas en respuesta directa
  }

  private getCookieValue(cookies: string | undefined, cookieName: string) {
    if (!cookies) {
      console.log('No cookies found');
      return null;
    }
    const match = cookies.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
    if (!match) {
      console.log(`Cookie ${cookieName} no encontrada`);
    }
    return match ? match[2] : null;
  }
}
