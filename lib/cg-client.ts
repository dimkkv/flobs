//1. Import coingecko-api
import axios from 'axios';
import CG from 'coingecko-api';
import { CGCoin } from './cg-all-coins-resp';
import { helper } from './helper';
import data from './coins.json';

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CG();

let coins: CGCoin[];
queueMicrotask;

export async function setupCoins() {
  try {
    const resp = await axios.get(
      'https://api.coingecko.com/api/v3/coins/list?include_platform=true',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    coins = resp.data;
  } catch (error) {
    console.log(error);
    coins = data;
  }
}

export function getCoins() {
  return coins;
}

//3. Make calls
export const getTokenData = async (address, chain) => {
  const chainName = helper.getChainByChainId(chain);
  const nativeToken = helper.getNativeTokenByChainId(chain);
  const coinShortData = coins.find(
    (coin) => coin.platforms[chainName || ''] === address
  );
  if (!coinShortData) {
    console.log('no coin data');
    return null;
  }
  const result = { address, chain, chainName, coinShortData };
  //console.log(result);
  return result;
};
