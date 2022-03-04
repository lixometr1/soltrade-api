import {
  TrackCollection,
  TrackCollectionDocument,
} from './entities/track-collection.entity';
import { Injectable } from '@nestjs/common';
import {
  CreateTrackCollectionDto,
  CreateTrackCollectionItemDto,
} from './dto/create-track-collection.dto';
import { UpdateTrackCollectionDto } from './dto/update-track-collection.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AddTrackStatsDto } from './dto/add-track-stats.dto';

@Injectable()
export class TrackCollectionService {
  constructor(
    @InjectModel(TrackCollection.name)
    private trackCollectionModel: Model<TrackCollectionDocument>,
  ) {}
  async create(createTrackCollectionDto: CreateTrackCollectionDto) {
    const doc = new this.trackCollectionModel(createTrackCollectionDto);
    return doc.save();
  }
  async addStats(id: string, stats: AddTrackStatsDto) {
    await this.trackCollectionModel.updateOne(
      { _id: id },
      { $push: { floor: stats.floor } },
    );
    return this.trackCollectionModel.findOne({ _id: id });
  }

  findAll() {
    return this.trackCollectionModel.find();
  }

  remove(id: string) {
    return this.trackCollectionModel.deleteOne({ _id: id });
  }
}
