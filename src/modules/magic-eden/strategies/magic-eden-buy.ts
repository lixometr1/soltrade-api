import {
  MEbuyTransaction,
  MagicEdenItem,
  getItem,
} from '@app/magic-eden-api';
import { MagicEdenService } from './../magic-eden.service';
import { MagicEdenClient } from './../magic-eden-client';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { connection, wallet } from 'src/helpers/web3-connection';
import { logger } from 'src/helpers/logger';
@Injectable()
export class MagicEdenBuy {
  constructor(
    @Inject(forwardRef(() => MagicEdenClient))
    private client: MagicEdenClient,
    @Inject(forwardRef(() => MagicEdenService))
    private magicEdenService: MagicEdenService,
  ) {}
  async exec(mintToken: string) {
    const item = await this.fetchItem(mintToken);
    logger.info('Fetched item');
    return this.execItem(item);
  }
  async execItem(item: MagicEdenItem) {
    const tx = await this.fetchBuyTx(item);
    logger.info('Fetched tx');
    return await this.magicEdenService.sendTx(tx);
  }
  async fetchItem(mintToken: string): Promise<MagicEdenItem> {
    const { data } = await getItem(mintToken);
    return data;
  }
  async fetchBuyTx(item: MagicEdenItem): Promise<number[]> {
    const { data } = await MEbuyTransaction({
      buyer: wallet.publicKey.toString(),
      seller: item.owner,
      auctionHouseAddress: item.v2.auctionHouseKey,
      tokenMint: item.mintAddress,
      tokenATA: item.id,
      sellerExpiry: item.v2.expiry,
      price: item.price,
      sellerReferral: item.v2.sellerReferral,
    });
    return data;
  }
}
