import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// Ignore unhandled Redis connection errors on serverless environments
process.on('unhandledRejection', (reason) => {
  console.warn('[Vercel Serverless Warning] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.warn('[Vercel Serverless Warning] Uncaught Exception:', err);
});

const server = express();

export const createExpressServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  await app.init();
  return app;
};

let cachedApp: any;

export default async function handler(req: any, res: any) {
  try {
    if (!cachedApp) {
      cachedApp = await createExpressServer(server);
    }
    server(req, res);
  } catch (err: any) {
    console.error('[Vercel Handler Error]', err);
    res.status(500).json({
      error: 'Vercel Serverless Function Startup Failure',
      message: err?.message || String(err),
    });
  }
}
