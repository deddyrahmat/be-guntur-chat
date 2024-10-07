import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173', 'https://fe-guntur-chat.vercel.app'], // Mengizinkan semua origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Metode yang diizinkan
    allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diizinkan
  });
  await app.listen(3000);
}
bootstrap();
