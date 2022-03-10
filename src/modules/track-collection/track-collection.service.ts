import { trackCollectionFieldsFilterAggregation } from './aggregations/track-collection-fields-filter-aggregation';
import { trackCollectionStatsAggregation } from './aggregations/track-collection-stats-aggregation';
import { filterArrayDateAggregation } from './aggregations/filter-array-date';
import { differenceAggregation } from './aggregations/difference.aggregation';
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
  async search(text: string) {
    return this.trackCollectionModel
      .find({
        collectionTitle: new RegExp(`.*${text}.*`, 'i'),
      })
      .limit(10);
  }
  async exists(collectionName: string) {
    return this.trackCollectionModel.exists({ collectionName });
  }
  async createIfNotExist(collectionName: string) {
    if (!(await this.trackCollectionModel.exists({ collectionName }))) {
      const col = new this.trackCollectionModel({ collectionName });
      await col.save();
    }
  }
  async addStats(collectionName: string, stats: AddTrackStatsDto) {
    const toPush: AddTrackStatsDto = {};
    if (stats.floor) {
      toPush.floor = stats.floor;
    }
    if (stats.volumes) {
      toPush.volumes = stats.volumes;
    }
    if (stats.listedCount) {
      toPush.listedCount = stats.listedCount;
    }
    await this.trackCollectionModel.updateOne(
      { collectionName },
      {
        $push: toPush,
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

  async findPopularCollections({ skip, limit }) {
    const result = await this.trackCollectionModel.aggregate([
      trackCollectionFieldsFilterAggregation(),
      trackCollectionStatsAggregation(),
      { $unset: ['floor24', 'volumes24', 'listedCount24'] },
      { $sort: { volumes24h: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    return result;
  }
  async findByCollection(collectionName: string) {
    // floor change between yesterday and now
    // listings change between yesterday and now
    // 24h volumes (today 00:00 - now)

    const [result] = await this.trackCollectionModel.aggregate([
      { $match: { collectionName } },
      trackCollectionFieldsFilterAggregation(30),
      trackCollectionStatsAggregation(),

      { $unset: ['floor24', 'volumes24', 'listedCount24'] },
      { $limit: 1 },
    ]);
    return result;
  }
  findAll() {
    return this.trackCollectionModel.find();
  }
  update(collectionName: string, updateDto: UpdateTrackCollectionDto) {
    return this.trackCollectionModel.updateOne({ collectionName }, updateDto);
  }
  remove(id: string) {
    return this.trackCollectionModel.deleteOne({ _id: id });
  }
}
