import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, Console, ConsoleService } from 'nestjs-console';
import {
  TrackCollection,
  TrackCollectionDocument,
} from './entities/track-collection.entity';
@Console()
export class TrackCollectionConsole {
  constructor(
    @InjectModel(TrackCollection.name)
    private trackCollectionModel: Model<TrackCollectionDocument>,
  ) {}
  @Command({
    command: 'removeDuplicats',
    description: 'Remove duplicats from statistic',
  })
  async removeDublicats() {
    console.log('run');
    const reduceAggregation = (field: string) => {
      return {
        $reduce: {
          input: `$${field}`,
          initialValue: [],
          in: {
            $concatArrays: [
              '$$value',
              {
                $cond: [
                  {
                    $in: ['$$this.date', '$$value.date'],
                  },
                  [],
                  ['$$this'],
                ],
              },
            ],
          },
        },
      };
    };
    const result = await this.trackCollectionModel.aggregate([
      {
        $addFields: {
          floor: reduceAggregation('floor'),
          volumes: reduceAggregation('volumes'),
          listedCount: reduceAggregation('listedCount'),
        },
      },
    ]);
    const resolvers = result.map((item) => {
      return this.trackCollectionModel.updateOne(
        { _id: item._id },
        {
          floor: item.floor,
          volumes: item.volumes,
          listedCount: item.listedCount,
        },
      );
    });
    await Promise.all(resolvers);
    console.log('done');

    // items.map(item => {
    //     item.floor.filter((item, index) => )
    // })
  }
}
