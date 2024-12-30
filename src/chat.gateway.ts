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
import { AuthGuard } from './auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages/messages.service';
import { GroupMembersService } from './chat-groups/group-members/group-members.service';
import { CreateMessageDto } from './messages/dto/create-message.dto';
import { UsersService } from './users/users.service';
import {
  NotificationType,
  NotificationStatus,
} from './notifications/entities/notification.entity';
import { NotificationsService } from './notifications/notifications.service';

dotenv.config({ path: './.env' });
@WebSocketGateway({
  namespace: 'chats',
  cors: {
    origin: process.env.DOMAIN_FRONT,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger(ChatGateway.name);

  constructor(
    private jwtAuthService: AuthGuard,
    private jwtService: JwtService,
    private groupMemberService: GroupMembersService,
    private messageService: MessagesService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {}

  afterInit() {
    this.logger.log('🚀 Socket Server Initialized');
  }

  async handleConnection(client: Socket) {
    console.log('🟢 Cliente conectado:', client.id);
    client.data = {};

    const token = client.handshake.auth.token;
    console.log('Token recibido en handshake:', token);

    if (!token) {
      this.logger.warn('Token no proporcionado');
      client.emit('error', 'Token no proporcionado');
      client.disconnect();
      return;
    }
    try {
      const decoded = this.jwtService.verify(token);
      console.log('Token decodificado:', decoded);

      client.join(decoded.id);
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
      this.logger.error('Token inválido', error);
      client.emit('error', 'Token inválido');
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('🔴 Cliente desconectado:', client.id);
    try {
      const token = client.handshake.auth.token;

      if (!token) {
        this.logger.warn(`Cliente desconectado sin token: ${client.id}`);
        return;
      }

      const context = {
        switchToWs: () => ({
          getClient: () => client,
          getData: () => ({ token }),
        }),
        getHandler: () => null,
        getClass: () => null,
        getType: () => 'ws',
      };

      const isValid = await this.jwtAuthService.canActivate(context as any);

      if (!isValid) {
        this.logger.warn(`Token inválido en desconexión: ${client.id}`);
        return;
      }

      const decoded = this.jwtService.decode(token) as Record<string, any>;

      this.logger.log(
        `Cliente desconectado: ${client.id} - Usuario: ${decoded?.email || 'desconocido'}`,
      );
    } catch (error) {
      this.logger.error(
        `Error en handleDisconnect: ${client.id}`,
        error.message,
      );
    }
  }

  @SubscribeMessage('message')
  async handleNewMessage(
    @MessageBody() payload: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (!payload.chatId && !payload.groupId) {
        throw new BadRequestException('Debe especificar un chatId o groupId');
      }

      const message = await this.messageService.createMessage(payload);

      if (payload.groupId) {
        this.server.to(payload.groupId).emit('receiveGroupMessage', message);
      } else if (payload.chatId) {
        payload.messageReceivers.forEach((receiverId) => {
          this.server.to(receiverId).emit('receivePrivateMessage', message);

          this.notificationsService
            .create({
              content: 'Nuevo mensaje privado',
              type: NotificationType.MESSAGE,
              user_id: receiverId,
            })
            .then((notification) => {
              this.server.to(receiverId).emit('messageNotification', {
                notification,
                message,
              });
            });
        });

        this.server
          .to(payload.sender_id)
          .emit('receivePrivateMessage', message);
      }
    } catch (error) {
      console.error('Error al manejar el mensaje:', error.message);
      client.emit('error', error.message);
    }
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
}
