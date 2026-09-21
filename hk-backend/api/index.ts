import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

// Ignore unhandled Redis connection errors on serverless environments
process.on('unhandledRejection', (reason) => {
  console.warn('[Vercel Serverless Warning] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.warn('[Vercel Serverless Warning] Uncaught Exception:', err);
});

let cachedServer: any;

async function bootstrapServerless() {
  const expressApp = express();

  // Express CORS Preflight Middleware for Vercel Edge & Serverless
  expressApp.use((req, res, next) => {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, x-idempotency-key, X-Requested-With');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
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
  return expressApp;
}

export default async function handler(req: any, res: any) {
  try {
    if (!cachedServer) {
      cachedServer = await bootstrapServerless();
    }
    return cachedServer(req, res);
  } catch (err: any) {
    console.error('[Vercel Serverless Handler Startup Error]', err);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(500).json({
      error: 'Vercel Serverless Function Startup Failure',
      message: err?.message || String(err),
    });
  }
}
