import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // 🔥 THAY ĐỔI: Sử dụng NestExpressApplication thay vì NestApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 🔥 THÊM: Validation Pipe global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 🔥 THÊM: Serve static files cho uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Config Swagger
  const config = new DocumentBuilder()
    .setTitle('SMS API')
    .setDescription('The sales management system API description')
    .setVersion('1.0')
    .addTag('sms')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 🔥 CẬP NHẬT: CORS để frontend có thể upload files
  app.enableCors({
    origin: true, // 🔥 CHO PHÉP MỌI ORIGIN
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept','X-Requested-With',
    'Content-Length'],
      exposedHeaders: ['Content-Disposition'], // 🔥 THÊM

  });

  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
  console.log(`📚 Swagger documentation: ${await app.getUrl()}/api`);
  console.log(`🖼️ Static files serving from: ${join(__dirname, '..', 'uploads')}`);
}

bootstrap();