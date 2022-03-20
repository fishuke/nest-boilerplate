import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as admin from 'firebase-admin';
import * as morgan from 'morgan';
import helmet from 'fastify-helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import config from './core/config';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // initializeFirebase();

  initializeValidationPipe(app);

  initializeMorgan(app);

  initializeSwagger(app);

  enableCors(app);

  await registerHelmet(app);

  await app.listen(3000, '0.0.0.0');
}

function initializeValidationPipe(app: NestFastifyApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
      transform: true,
      whitelist: true, // Delete properties which is not in dto
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      // skipMissingProperties: true,
    }),
  );
}

async function registerHelmet(app: NestFastifyApplication) {
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
}

function initializeSwagger(app: NestFastifyApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Boilerplate')
    .setDescription('Never gonna give you up.')
    .setVersion(config.version)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
  });
}

function initializeMorgan(app: NestFastifyApplication) {
  app.use(
    morgan(':remote-addr :url :method :req[origin] :status :response-time ms'),
  );
}

function enableCors(app: NestFastifyApplication) {
  app.enableCors({
    origin: [config.origin],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}

function initializeFirebase() {
  admin.initializeApp({
    credential: admin.credential.cert(config.firebase.credential),
    databaseURL: config.firebase.databaseURL,
  });
}

bootstrap().then(() => logger.log(`Server is running on port ${config.port}.`));
