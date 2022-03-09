import { TrackPublicModule } from './modules/track-public/track-public.module';
import { TrackCollectionModule } from './modules/track-collection/track-collection.module';
import { OrderModule } from './modules/order/order.module';
import { MagicEdenModule } from './modules/magic-eden/magic-eden.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TrackClientModule } from './modules/track-client/track-client.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    BullModule.forRoot({
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),

    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost/solbot',
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    MagicEdenModule,
    OrderModule,
    TrackPublicModule,
    TrackCollectionModule,
    TrackClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
