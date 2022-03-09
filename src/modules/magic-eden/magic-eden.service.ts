import { MagicEdenBuyFloorDto } from './dto/magic-eden-buy-floor.dto';
import * as magicEden from '@app/magic-eden-api';
import { OrderService } from './../order/order.service';
import { MagicEdenTrack } from './strategies/magic-eden-track';
import { MagicEdenSell } from './strategies/magic-eden-sell';
import { MagicEdenBuy } from './strategies/magic-eden-buy';
import { MagicEdenClient } from './magic-eden-client';
import { forwardRef, Inject, Injectable, Body, UnprocessableEntityException, InternalServerErrorException } from '@nestjs/common';
import { connection, wallet } from 'src/helpers/web3-connection';
import { CreateMagicEdenDto } from './dto/create-magic-eden.dto';
import { UpdateMagicEdenDto } from './dto/update-magic-eden.dto';
import * as web3 from '@solana/web3.js';
import * as cloudscraper from 'cloudscraper';
import { logger } from 'src/helpers/logger';
import { IRpcTransactionInfo } from './types/rpc-transaction-info.interface';
import { MagicEdenItem } from '@app/magic-eden-api';
import { fetchRetry } from 'src/helpers/fetch-retry';

@Injectable()
export class MagicEdenService {
  constructor(
    private client: MagicEdenClient,
    @Inject(forwardRef(() => MagicEdenBuy))
    private buyStrategy: MagicEdenBuy,
    @Inject(forwardRef(() => MagicEdenSell))
    private sellStrategy: MagicEdenSell,
    @Inject(forwardRef(() => MagicEdenTrack))
    private trackStrategy: MagicEdenTrack,
  ) {}
  async test() {
    // this.airdrop();
    // return await this.sell('skcSSUQ9MMFLXVos74W12oHFa6jMk8bLzvcudUqnFjj', 0.02);
    // this.trackStart('magicticket');
    return this.getMagicEdenTransactionInfo(
      '5ovEfECLoSb75F4zuyK6otrh51WMzGaEteozkhVgfibV1XPjnbCGYUVNZoZy7jYcVKschThA6TCzkUG6wXgGDpSM',
    );
    // return this.getMagicEdenTransactionInfo(
    //   '4QY1X22crC6K1PLToyhonz23VR8orJguKuRhDZGGXkuHrpD413ozw7vWoyin2GuipTkQhm4dBTc4GKgUdfjBZ97f',
    // );
  }

  async getTransacitonInfo(
    transactionId: string,
  ): Promise<IRpcTransactionInfo> {
    const response = await cloudscraper.post('https://magiceden.rpcpool.com/', {
      json: {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
        params: [transactionId, 'json'],
      },
    });
    return response;
  }
  async getMagicEdenTransactionInfo(transactionId: string) {
    const { data } = await magicEden.getTransactionInfo(transactionId);
    return data;
  }
  async getCollectionItems(slug: string): Promise<MagicEdenItem[]> {
    const { data, headers } = await magicEden.getCollectionItems({
      slug,
      sort: { takerAmount: 1, createdAt: -1 },
      skip: 0,
      limit: 20,
    });
    console.log('limit ', headers['x-ratelimit-remaining']);
    return data;
  }
  async getListedItems() {
    const { data } = await magicEden.getListedItems(
      wallet.publicKey.toString(),
    );
    return data;
  }
  async getMyItems() {
    const { data } = await magicEden.getMyItems(wallet.publicKey.toString());
    return data;
  }

  trackStop(id: string) {
    return this.trackStrategy.stop(id);
  }
  trackStartOrder(collectionName: string) {
    return this.trackStrategy.execWithOrder(collectionName);
  }
  trackStart(collectionName: string) {
    return this.trackStrategy.track(collectionName, 500);
  }
  async sell(mintToken: string, price: number) {
    return this.sellStrategy.exec(mintToken, price);
  }
  async buy(mintToken: string) {
    return this.buyStrategy.exec(mintToken);
  }
  async buyFloorPrice({ collectionName, buyer }: MagicEdenBuyFloorDto) {
    const response = await fetchRetry(() =>
      magicEden.getFloorPrice(collectionName),
    );
    if(!response) {
      throw new InternalServerErrorException('Error. Please try again')
    }
    const { items, data } = response
     const cheapestItem = items.find((item) => item.price <= data);
    const tx = await this.buyStrategy.fetchBuyTx(cheapestItem, buyer);
    // const transaction = web3.Transaction.populate(
    //   web3.Message.from(Buffer.from(tx)),
    // );
    return tx;
  }
  async sendTx(tx: number[]) {
    const transaction = web3.Transaction.populate(
      web3.Message.from(Buffer.from(tx)),
    );
    const transactionId = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet],
    );
    // const info = await this.getTransacitonInfo(transactionId);
    const meInfo = await this.getMagicEdenTransactionInfo(transactionId);
    let status = 1;

    if (!meInfo.instructions.length) {
      status = 0;
    }
    return { status, transactionId };
  }
  async airdrop() {
    const airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      web3.LAMPORTS_PER_SOL,
    );

    await connection.confirmTransaction(airdropSignature);
    const account = await connection.getAccountInfo(wallet.publicKey);
    console.log('10', account, account.data.toString());
  }
}
