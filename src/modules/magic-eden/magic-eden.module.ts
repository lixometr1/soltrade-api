import { OrderService } from './../order/order.service';
import { OrderModule } from './../order/order.module';

import { MagicEdenTrack } from './strategies/magic-eden-track';
import { MagicEdenSell } from './strategies/magic-eden-sell';
import { MagicEdenBuy } from './strategies/magic-eden-buy';
import { MagicEdenClient } from './magic-eden-client';
import { Inject, Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { MagicEdenService } from './magic-eden.service';
import { MagicEdenController } from './magic-eden.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [forwardRef(() => OrderModule)],
  controllers: [MagicEdenController],
  providers: [
    MagicEdenService,
    MagicEdenClient,
    MagicEdenBuy,
    MagicEdenSell,
    MagicEdenTrack,
  ],
  exports: [MagicEdenService],
})
export class MagicEdenModule implements OnModuleInit {
  constructor(
    private client: MagicEdenClient,
    private magicEdenService: MagicEdenService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
  ) {}
  async onModuleInit() {
    this.client.init();

  
    // const orders = await this.orderService.findNotDone();
    // orders.forEach((order) => {
    //   this.magicEdenService.trackStartOrder(order.collectionName);
    // });
  }
}
