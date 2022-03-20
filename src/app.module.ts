import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@user/user.module';
import { SessionModule } from '@session/session.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from '@config';
import { validate } from '@core/config/validation';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 30,
    }),
    ConfigModule.forRoot({ validate }),
    MongooseModule.forRoot(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
    }),
    UserModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
