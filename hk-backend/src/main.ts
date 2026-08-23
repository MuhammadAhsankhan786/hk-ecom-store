import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Helmet HTTP security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disabled for Swagger inline styles
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Enable CORS for Next.js storefront and Vite Admin panel
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe for DTO input validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('HK Fabric — Production E-Commerce API Platform')
    .setDescription('Production-Grade Scalable REST APIs for Customer Storefront & Admin Panel')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-idempotency-key', in: 'header' }, 'x-idempotency-key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 HK Fabric Production Backend running on http://localhost:${port}`);
  console.log(`📑 OpenAPI Swagger Documentation available at http://localhost:${port}/api/docs`);
}
bootstrap();
