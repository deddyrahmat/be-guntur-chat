import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://fe-guntur-chat.vercel.app'], // Beberapa origin yang diizinkan
  });
  await app.listen(3000);
}
bootstrap();
