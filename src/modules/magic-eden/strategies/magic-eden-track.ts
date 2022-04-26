import { MagicEdenSell } from './magic-eden-sell';
import { OrderService } from './../../order/order.service';
import { Inject, forwardRef } from '@nestjs/common';
import { MagicEdenClient } from './../magic-eden-client';
import { MagicEdenService } from '../magic-eden.service';
import { logger } from 'src/helpers/logger';
import { MagicEdenBuy } from './magic-eden-buy';
import { v4 as uuid } from 'uuid';
import { MagicEdenItem } from '@app/magic-eden-api';
import { fetchRetry } from 'src/helpers/fetch-retry';
export class MagicEdenTrack {
  private trackers = {};
  constructor(
    @Inject(forwardRef(() => MagicEdenClient)) private client: MagicEdenClient,
    @Inject(forwardRef(() => MagicEdenService))
    private magicEdenService: MagicEdenService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
    @Inject(forwardRef(() => MagicEdenBuy))
    private buyStrategy: MagicEdenBuy,
    @Inject(forwardRef(() => MagicEdenSell))
    private sellStrategy: MagicEdenSell,
  ) {}
  async exec(
    collectionName: string,
    fn: (items: MagicEdenItem[], id: string) => Promise<void>,
    time = 300,
  ) {
    const id = collectionName;
    logger.info('Track Start - ' + id);
    this.trackers[id] = true;
    (async () => {
      while (true) {
        if (!this.trackers[id]) return;
        const items = await fetchRetry(() =>
          this.magicEdenService.getCollectionItems(collectionName),
        );
        items?.sort((a, b) => a.price - b.price)
        await fn(items, id);
        await new Promise((resolve) =>
          setTimeout(() => {
            resolve(1);
          }, time),
        );
      }
    })();
    return id;
  }
  stop(id: string) {
    logger.info('Track stop ' + id);
    delete this.trackers[id];
  }
  track(collectionName: string, time?: number) {
    return this.exec(
      collectionName,
      async (items) => {
        const firstItem = items[0];
        logger.info(
          `Track - ${collectionName}; ${firstItem.mintAddress} ${firstItem.price} `,
        );
      },
      time,
    );
  }
  async execWithOrder(collectionName: string) {
    return this.exec(collectionName, async (items, id) => {
      const firstItem = items[0];

      const order = await this.orderService.findByCollection(collectionName);
      if (!order) {
        logger.info('No orders');
        return;
      }
      logger.info(
        `Track - ${collectionName}; ${firstItem.mintAddress} ${firstItem.price}; ${order.limit} `,
      );
      const foundItem = items.find((item) => item.price <= order.limit);
      if (!foundItem) return;
      logger.info(`Found item; ${foundItem.mintAddress} - ${foundItem.price}`);

      const { transactionId, status } = await this.buyStrategy.execItem(
        foundItem,
      );
      if (status === 1) {
        await this.orderService.fullfillOrder(order._id);
        this.stop(id);
        logger.info(`Order ${order.id} done! ${transactionId} - ${status}`);
      } else {
        logger.info(`Order ${order.id} ERROR! `);
        throw 'ERROR'
      }
    });
  }
}
