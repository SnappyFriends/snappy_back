/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'socket.io';
import { HttpAdapterHost } from '@nestjs/core';
import { loggerGlobal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(loggerGlobal);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  });

  const httpAdapter = app.get(HttpAdapterHost);
  const server = httpAdapter.httpAdapter.getHttpServer();
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Cliente conectado');
  });

  const config = new DocumentBuilder()
    .setTitle('Snappy API')
    .setDescription('SnappyFriends API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    customSiteTitle: "SnappyFriends API"
  });

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
