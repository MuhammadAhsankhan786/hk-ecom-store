import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

// Express CORS Preflight Middleware for Vercel Edge & Serverless
server.use((req: any, res: any, next: any) => {
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

let isInitialized = false;
let initError: any = null;

function loadAppModule() {
  try {
    return require('../dist/src/app.module').AppModule;
  } catch (err1) {
    try {
      return require('../src/app.module').AppModule;
    } catch (err2) {
      console.error('[NestJS AppModule Load Error]', err1, err2);
      throw err1;
    }
  }
}

async function initNestApp() {
  if (isInitialized) return;
  try {
    const AppModule = loadAppModule();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
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
    isInitialized = true;
  } catch (err: any) {
    initError = err;
    console.error('[NestJS Init Error]', err);
  }
}

export default async function handler(req: any, res: any) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, x-idempotency-key, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await initNestApp();
    if (initError) {
      return res.status(200).json({
        status: 'online',
        message: 'HK Fabric Backend Edge API Active',
        error: initError?.message || String(initError),
      });
    }
    return server(req, res);
  } catch (err: any) {
    return res.status(200).json({
      status: 'online',
      message: 'HK Fabric Serverless Edge Active',
      error: err?.message || String(err),
    });
  }
}
