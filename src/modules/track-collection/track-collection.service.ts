import { TrackCollectionUpdateEvent } from './events/track-collection-update.event';
import { EventEmitter2 } from 'eventemitter2';
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
    private events: EventEmitter2,
  ) {}
  async create(createTrackCollectionDto: CreateTrackCollectionDto) {
    const doc = new this.trackCollectionModel(createTrackCollectionDto);
    return doc.save();
  }
  async createIfNotExist(collectionName: string) {
    if (!(await this.trackCollectionModel.exists({ collectionName }))) {
      const col = new this.trackCollectionModel({ collectionName });
      await col.save();
    }
  }
  async addStats(collectionName: string, stats: AddTrackStatsDto) {
    await this.createIfNotExist(collectionName);
    await this.trackCollectionModel.updateOne(
      { collectionName },
      {
        $push: {
          floor: stats.floor,
          volumes: stats.volumes,
          listedCount: stats.listedCount,
        },
      },
    );
    this.events.emit('track-collection:update', {
      collectionName,
      floor: stats.floor,
      volumes: stats.volumes,
      listedCount: stats.listedCount,
    } as TrackCollectionUpdateEvent);
  }
  async addFloor(collectionName: string, floor: CreateTrackCollectionItemDto) {
    await this.createIfNotExist(collectionName);
    await this.trackCollectionModel.updateOne(
      { collectionName },
      {
        $push: {
          floor,
        },
      },
    );
    this.events.emit('track-collection:update', {
      collectionName,
      floor,
    } as TrackCollectionUpdateEvent);
  }
  async addVolumesAndListedCount(
    collectionName: string,
    {
      volumes,
      listedCount,
    }: {
      volumes: CreateTrackCollectionItemDto;
      listedCount: CreateTrackCollectionItemDto;
    },
  ) {
    await this.createIfNotExist(collectionName);
    await this.trackCollectionModel.updateOne(
      { collectionName },
      {
        $push: {
          volumes,
          listedCount,
        },
      },
    );
    this.events.emit('track-collection:update', {
      collectionName,
      volumes,
      listedCount,
    } as TrackCollectionUpdateEvent);
  }

  findByCollection(collectionName: string) {
    return this.trackCollectionModel.findOne({ collectionName });
  }
  findAll() {
    return this.trackCollectionModel.find();
  }

  remove(id: string) {
    return this.trackCollectionModel.deleteOne({ _id: id });
  }
}
