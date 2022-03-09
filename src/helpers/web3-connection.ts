import * as web3 from '@solana/web3.js';
import * as base58 from 'base58-js';
const privateKey = process.env.PRIVATE_KEY;

const network = web3.clusterApiUrl('mainnet-beta');
const connection = new web3.Connection(network, 'confirmed');

let wallet;
if (privateKey) {
  const arr = base58.base58_to_binary(privateKey);
  wallet = web3.Keypair.fromSecretKey(arr);
}

export { connection, wallet };
