/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'socket.io';
import { HttpAdapterHost } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  const httpAdapter = app.get(HttpAdapterHost);
  const server = httpAdapter.httpAdapter.getHttpServer();
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Cliente conectado');
  });

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
