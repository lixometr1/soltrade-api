import { IGetCollectionStats } from '../../../libs/magic-eden-api/src/functions/get-collection-stats';
import { IGetCollectionItem } from '../../../libs/magic-eden-api/src/functions/get-all-collections';
import { getVolumesAndListedCount } from '../../../libs/magic-eden-api/src/functions/get-volumes-and-listed-count';
import { fetchRetry } from '../../helpers/fetch-retry';
import { TrackCollectionService } from '../track-collection/track-collection.service';
import * as magicEden from '@app/magic-eden-api';
import { Inject, forwardRef } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as web3 from '@solana/web3.js';
import { logger } from 'src/helpers/logger';
import { Requester } from 'cloudscraper';
import { RequestError } from 'cloudscraper/errors';
import * as cloudscraper from "cloudscraper"
// cloudscrape
export class TrackClientCrawlerService {
  constructor(
    @Inject(forwardRef(() => TrackCollectionService))
    private trackCollection: TrackCollectionService,
  ) {}
  async run() {
    logger.info('Run Crawler');
    let { data: collections } = await fetchRetry(magicEden.getAllCollections);
    if (!collections) {
      const { data } = await fetchRetry(magicEden.getAllCollections);
      collections = data;
    }
    if (!collections) {
      logger.info('Crawler error, waiting 1 minute');
      setTimeout(() => {
        this.run();
      }, 600000);
      return;
    }
    const startDate = new Date().getTime();
    const perPage = 200;
    let steps = Math.ceil(collections.length / perPage);
    for (let i = 0; i < steps; i += 1) {
      const items = collections.slice(i * perPage, perPage * i + perPage);
      const names = items.map((item) => item.symbol);
      const { data: result } = await magicEden.getMulticollectionStats(names);
      const resolvers = result.map((stats) => {
        const collection = collections.find(
          (item) => item.symbol === stats.symbol,
        );
        return this.proceedItem(collection, stats);
      });
      await Promise.all(resolvers);
    }
    const endDate = new Date().getTime();
    const d = endDate - startDate;
    logger.info(`Crawler end in  + ${d / 1000}s`);
  }
  async proceedItem(
    collection: IGetCollectionItem,
    stats: IGetCollectionStats,
  ) {
    try {
      let floorPrice = stats.floorPrice / web3.LAMPORTS_PER_SOL;
      floorPrice = +floorPrice.toFixed(3);
      if (isNaN(floorPrice)) {
        floorPrice = undefined;
      }
      const listedCount = stats.listedCount;
      let volumes = stats.volumeAll / web3.LAMPORTS_PER_SOL;
      if (!stats.volumeAll) {
        volumes = 0;
      } else {
        volumes = +volumes.toFixed(2);
      }

      const date = new Date().toUTCString();
      const collectionEntity = {
        collectionName: collection.symbol,
        collectionTitle: collection.name,
        description: collection.description,
        totalItems: collection.totalItems,
        image: collection.image,
        discord: collection.discord,
        twitter: collection.twitter,
        website: collection.website,
      };

      if (!(await this.trackCollection.exists(collection.symbol))) {
        await this.trackCollection.create(collectionEntity);
      } else {
        await this.trackCollection.update(collection.symbol, collectionEntity);
      }
      await this.trackCollection.addStats(collection.symbol, {
        floor: floorPrice && { value: floorPrice, date },
        listedCount: listedCount && { value: listedCount, date },
        volumes: volumes && { value: volumes, date },
      });
    } catch (err: any) {
      if (err instanceof RequestError) {
        if (err.response.statusCode === 500) return;
      }
      console.log(err);
      logger.error(`Processing error in crawler`);
    }
  }

  @Cron('0 */30 * * * *')
  schedule() {
    // every 30 min
    this.run();
  }
}
