import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AuthGuard } from './auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

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
}
