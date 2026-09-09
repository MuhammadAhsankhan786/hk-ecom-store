import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  // Helmet HTTP security headers
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Enable CORS for Next.js storefront and Vite Admin panel (Explicit Whitelist Policy)
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'https://hk-ecom-store.vercel.app',
    'https://hk-admin.vercel.app',
  ];

  const originsWhitelist = allowedOrigins.length > 0 ? allowedOrigins : defaultOrigins;

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || originsWhitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin blocked by security policy: ${origin}`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe for DTO input validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger OpenAPI Documentation (Only in non-production environments)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('HK Fabric — Production E-Commerce API Platform')
      .setDescription('Production-Grade Scalable REST APIs for Customer Storefront & Admin Panel')
      .setVersion('1.0')
      .addBearerAuth()
      .addApiKey({ type: 'apiKey', name: 'x-idempotency-key', in: 'header' }, 'x-idempotency-key')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 HK Fabric Production Backend running on http://localhost:${port}`);
  console.log(`📑 OpenAPI Swagger Documentation available at http://localhost:${port}/api/docs`);
}
bootstrap();
