import { TrackCollectionConsole } from './track-collection.console';
import {
  TrackCollection,
  TrackCollectionSchema,
} from './entities/track-collection.entity';
import { Module } from '@nestjs/common';
import { TrackCollectionService } from './track-collection.service';
import { TrackCollectionController } from './track-collection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsoleModule } from 'nestjs-console';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrackCollection.name, schema: TrackCollectionSchema },
    ]),
    ConsoleModule,
  ],
  controllers: [TrackCollectionController],
  providers: [TrackCollectionService, TrackCollectionConsole],
  exports: [TrackCollectionService],
})
export class TrackCollectionModule {}
