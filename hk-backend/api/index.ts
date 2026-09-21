import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// Import compiled NestJS AppModule from dist build output
let AppModule: any;
try {
  AppModule = require('../dist/src/app.module').AppModule;
} catch {
  AppModule = require('../src/app.module').AppModule;
}

// Ignore unhandled Redis connection errors on serverless environments
process.on('unhandledRejection', (reason) => {
  console.warn('[Vercel Serverless Warning] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.warn('[Vercel Serverless Warning] Uncaught Exception:', err);
});

const server = express();

// Express CORS Preflight Middleware for Vercel Edge & Serverless
server.use((req, res, next) => {
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
