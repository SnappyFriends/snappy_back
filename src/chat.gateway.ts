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
import {
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AuthGuard } from './auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ChatGroupsService } from './chat-groups/chat-groups.service';
import { MessagesService } from './messages/messages.service';
import { GroupMembersService } from './chat-groups/group-members/group-members.service';
import { CreateMessageDto } from './messages/dto/create-message.dto';
import { UsersService } from './users/users.service';

dotenv.config({ path: './.env' });
@WebSocketGateway({
  namespace: 'chats',
  cors: {
    origin: process.env.CORS_ORIGIN,
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
  ) {}

  afterInit() {
    this.logger.log('🚀 Socket Server Initialized');
  }

  async handleConnection(client: Socket) {
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
        client.emit('error', 'Token inválido');
        client.disconnect();
        return;
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
        });
      }
    } catch (error) {
      console.error('Error al manejar el mensaje:', error.message);
      client.emit('error', error.message);
    }
  }
}
