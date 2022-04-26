import { wallet as keyPair } from 'src/helpers/web3-connection';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MagicEdenClient } from '../magic-eden-client';
import { MagicEdenService } from '../magic-eden.service';
import * as spl from '@solana/spl-token';
import * as web3 from '@solana/web3.js';
import * as metaplex from '@metaplex/js';
import * as anchor from '@project-serum/anchor';
import * as base58 from 'base58-js';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';
interface MECandyMachineInfo {
  authority: web3.PublicKey;
  wallet: web3.PublicKey;
  tokenMint: any;
  config: web3.PublicKey;
  itemsRedeemedNormal: anchor.BN;
  itemsRedeemedRaffle: anchor.BN;
  raffleTicketsPurchased: anchor.BN;
  uuid: string;
  itemsAvailable: anchor.BN;
  raffleSeed: anchor.BN;
  bump: number;
  notary: web3.PublicKey;
  orderInfo: web3.PublicKey;
}
//H4Avs75PbotvRb7v5ThZiLnEvAYr5YMCUtXjqY2GQm2b
const machineProgram = 'CMZYPASGWeTz7RNGHaRJfCq2XQ5pYK6nDvVQxzkH51zb';
const _ = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// ---------------
// BEARZ - 3xVDoLaecZwXXtN59o6T3Gfxwjcgf8Hc9RfoqBn995P9
const cmid = 'DdjkwaWNSMqmkY9N19Rtm9HGGk8aajwxMzgE7K3tYAKw';
// --------------


const cmidKey = new web3.PublicKey(cmid);

// TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
const TOKEN_PROGRAM_ID = spl.TOKEN_PROGRAM_ID;
// ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL  (x)
const ASSOCIATED_PROGRAM_ID = spl.ASSOCIATED_TOKEN_PROGRAM_ID;

// const connection = new web3.Connection('https://solport.genesysgo.net/');
const connection = new web3.Connection('https://solana-api.syndica.io/access-token/WBEQBeezC9DKGwtQUZ3RcNEgr5bLxsRPCMu0MrubAS31X2J2M7PftKt42pkh9roP/rpc', {httpHeaders: {
  origin: "https://magiceden.io"
}});
const wallet = new anchor.Wallet(keyPair);
const provider = new anchor.Provider(connection, wallet, {});
// diff: ['metadata', 'mint', 'tokenAta', 'masterEdition']
@Injectable()
export class MagicEdenMint {
  constructor(
    @Inject(forwardRef(() => MagicEdenClient))
    private client: MagicEdenClient,
    @Inject(forwardRef(() => MagicEdenService))
    private magicEdenService: MagicEdenService,
  ) {}
  async pause(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  @Cron('57 42 22 * * *')
  async run() {
    await this.client.exec('https://wk-notary-prod.magiceden.io/contract/DdjkwaWNSMqmkY9N19Rtm9HGGk8aajwxMzgE7K3tYAKw')
    // for (let i = 0; i < 100; i++) {
      for (let i = 0; i < 3; i++) {
        this.exec();
        await this.pause(50)
      }
      await this.pause(200)
    // }
  }
  async exec() {
    const data = await this.getSaleData();
    // console.log(data.state.orderInfo.toString());
    await this.createTransaction(data);
  }
  async getSaleData() {
    const price = 2;
    const walletLimit = 1;
    const startDate = '2020-01-02';

    // u.$r - Program

    const info = await anchor.Program.fetchIdl(machineProgram, provider);
    const program = new anchor.Program(info, machineProgram, provider);

    const candyInfo = (await program.account.candyMachine.fetch(
      cmidKey,
    )) as any as MECandyMachineInfo;
    const totalItems = candyInfo.itemsAvailable.toNumber();
    const mintedItems = candyInfo.itemsRedeemedNormal.toNumber();
    const leftItems = totalItems - mintedItems;
    const state = {
      itemsAvailable: totalItems,
      itemsRedeemed: mintedItems,
      itemsRemaining: leftItems,
      isSoldOut: 0 === leftItems,
      treasury: candyInfo.wallet,
      wallet: candyInfo.wallet,
      price,
      goLiveData: startDate,
      config: candyInfo.config,
      tokenMint: candyInfo.tokenMint,
      uuid: candyInfo.uuid,
      // launchStagesInfo: d,
      // eligibleStages: h,
      notary: candyInfo.notary,
      walletLimitInfo: walletLimit,
      orderInfo: candyInfo.orderInfo,
    };
    return { id: cmid, program, state };
  }
  async createTransaction(data: any) {
    // f
    const tempWallet = web3.Keypair.generate();

    // m
    const assosiatedTokenAddressRes = await spl.Token.getAssociatedTokenAddress(
      new web3.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
      new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      tempWallet.publicKey,
      wallet.publicKey,
    );

    // console.log('m: ', assosiatedTokenAddressRes.toString())
    // console.log('metadata', metadata.toString());
    // console.log('masterEdition', masterEdition.toString());
    // return;
    const d = data.state.config;
    const h = new web3.PublicKey(data.id);

    const S = await this.getMetadata(tempWallet.publicKey);
    const M = await this.getMasterEdition(tempWallet.publicKey);
    const I = await this.getWalletLimit0();
    const O = await this.getWalletLimit1();
    const T = await this.getLaunchStages();
    const N = {
      config: d,
      candyMachine: h,
      launchStagesInfo: T,
      mintReceiver: wallet.publicKey,
      payer: wallet.publicKey,
      wallet: data.state.wallet,
      mint: tempWallet.publicKey,
      tokenAta: assosiatedTokenAddressRes,
      metadata: S,
      masterEdition: M,

      walletLimitInfo: I,
      tokenMetadataProgram: _,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,

      rent: web3.SYSVAR_RENT_PUBKEY,

      orderInfo: data.state.orderInfo,

      slotHashes: new web3.PublicKey(
        'SysvarS1otHashes111111111111111111111111111',
      ),
      associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      // mintAuthority: wallet.publicKey,
      // updateAuthority: wallet.publicKey,
      // clock: web3.SYSVAR_CLOCK_PUBKEY,
    };
    let test = {};
    Object.keys(N).forEach((key) => {
      test[key] = N[key].toString();
    });
    // console.log(test)
    const remainingAccounts = [
      {
        pubkey: web3.SystemProgram.programId,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: wallet.publicKey,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: data.state.notary,
        isWritable: false,
        isSigner: true,
      },
    ];

    const b = new web3.TransactionInstruction({
      keys: [],
      programId: new web3.PublicKey(
        'ComputeBudget111111111111111111111111111111',
      ),
      data: Buffer.from(new Uint8Array([0, 224, 147, 4, 0])),
    });
    const v = new web3.TransactionInstruction({
      keys: [],
      programId: new web3.PublicKey(
        'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
      ),
      data: Buffer.from('2EE2Hhoe8fVAYn7J5qwuayNmrEgmTPskLyszojv'),
    });
    // not sure about count it is 5 there
    const L = (data.program as anchor.Program).transaction.mintNft(
      // O
      O,
      false,
      null,
      {
        accounts: N,

        remainingAccounts,
        signers: [tempWallet],
        instructions: [b, v],
      },
    );

    const { blockhash } = await connection.getRecentBlockhash('processed');
    L.recentBlockhash = blockhash;

    L.feePayer = wallet.publicKey;
    const U = L.serializeMessage();

    const K = await this.signMETransaction(U);
    const q = base58.base58_to_binary(K.signature);
    const signed = await wallet.signTransaction(L);
    signed.partialSign(tempWallet);
    signed.addSignature(data.state.notary, q);

    try {
      const res = await connection.sendRawTransaction(
        signed.serialize({ verifySignatures: false }),
        { preflightCommitment: 'processed' },
      );
      console.log('sent', res)
    } catch (err) {
      console.log('err', err);
    }
  }
  async signMETransaction(message: Buffer): Promise<{
    publicKey: string;
    signature: string;
  }> {
    const res = await this.client.exec(
      'https://wk-notary-prod.magiceden.io/sign',
      {
        json: true,
        method: 'POST',
        body: { response: '', message: base58.binary_to_base58(message) },
        headers: {
          ar_session_token: 'stub-until-arkose-is-fixed',
          origin: 'https://magiceden.io',
          pragma: 'no-cache',
          referer: 'https://magiceden.io/',
        },
      },
    );
    return res.body;
  }
  async getMasterEdition(key: web3.PublicKey) {
    const res = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        _.toBuffer(),
        key.toBuffer(),
        Buffer.from('edition'),
      ],
      _,
    );
    return res[0];
  }
  async getWalletLimit0() {
    const res = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from('wallet_limit'),
        cmidKey.toBuffer(),
        wallet.publicKey.toBuffer(),
      ],
      new web3.PublicKey(machineProgram),
    );
    return res[0];
  }
  async getWalletLimit1() {
    const res = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from('wallet_limit'),
        cmidKey.toBuffer(),
        wallet.publicKey.toBuffer(),
      ],
      new web3.PublicKey(machineProgram),
    );
    return res[1];
  }
  async getLaunchStages() {
    const res = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from('candy_machine'),
        Buffer.from('launch_stages'),
        cmidKey.toBuffer(),
      ],
      new web3.PublicKey(machineProgram),
    );

    return res[0];
  }
  async getMetadata(key: web3.PublicKey) {
    const res = await web3.PublicKey.findProgramAddress(
      [Buffer.from('metadata'), _.toBuffer(), key.toBuffer()],
      _,
    );
    return res[0];
  }
  async getMeSaleInfo(cmid: string) {
    const res = await this.client.exec(
      `https://wk-notary-prod.magiceden.io/contract/${cmid}/`,
      { json: true },
    );
    const meSaleInfo = res.body;
    return meSaleInfo;
  }
}
