import { MagicEdenService } from './../magic-eden.service';
import { MagicEdenClient } from './../magic-eden-client';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as web3 from '@solana/web3.js';
import { connection, wallet } from 'src/helpers/web3-connection';
import { logger } from 'src/helpers/logger';
import { MagicEdenItem } from '@app/magic-eden-api';
@Injectable()
export class MagicEdenSell {
  constructor(
    @Inject(forwardRef(() => MagicEdenClient))
    private client: MagicEdenClient,
    @Inject(forwardRef(() => MagicEdenService))
    private magicEdenService: MagicEdenService,
  ) {}
  async exec(mintToken: string, price: number) {
    const item = await this.fetchItem(mintToken);
    logger.info('Fetched item');
    const tx = await this.fetchSellTx(item, price);
    logger.info('Fetched tx');
    return await this.magicEdenService.sendTx(tx);
  }
  async fetchItem(mintToken: string): Promise<MagicEdenItem> {
    const response = await this.client.exec(
      `https://api-mainnet.magiceden.io/rpc/getNFTByMintAddress/${mintToken}`,

      { method: 'GET', json: true },
    );
    return response.body.results;
  }
  async fetchSellTx(item: MagicEdenItem, price: number): Promise<number[]> {
    const url = 'https://api-mainnet.magiceden.io/v2/instructions/sell';
    const response = await this.client.exec(url, {
      qs: {
        seller: wallet.publicKey.toString(),
        auctionHouseAddress: 'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe',
        tokenMint: item.mintAddress,
        tokenAccount: item.id,
        price: price,
        sellerExpiry: -1,
      },
      headers: {
        origin: 'https://magiceden.io',
        pragma: 'no-cache',
        referer: 'https://magiceden.io/',
      },
      method: 'GET',
      json: true,
    });
    return response.body.tx.data;
  }
}
