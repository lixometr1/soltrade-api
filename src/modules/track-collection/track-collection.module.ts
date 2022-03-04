import {
  TrackCollection,
  TrackCollectionSchema,
} from './entities/track-collection.entity';
import { Module } from '@nestjs/common';
import { TrackCollectionService } from './track-collection.service';
import { TrackCollectionController } from './track-collection.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrackCollection.name, schema: TrackCollectionSchema },
    ]),
  ],
  controllers: [TrackCollectionController],
  providers: [TrackCollectionService],
  exports: [TrackCollectionService],
})
export class TrackCollectionModule {}
