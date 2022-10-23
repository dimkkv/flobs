function getTokenPrice(chain, asset) {
  return `https://api.coingecko.com/api/v3/simple/token_price/${chain}?contract_addresses=${asset}&vs_currencies=usd`;
}

function getNativeTokenPrice(chain) {
  return `https://api.coingecko.com/api/v3/simple/price?ids=${chain}&vs_currencies=usd`;
}

function getChainByChainId(chainId) {
  switch (chainId) {
    case 1:
      return 'ethereum';
    case 10:
      return 'optimistic-ethereum';
    case 56:
      return 'binance-smart-chain';
    case 137:
      return 'polygon-pos';
    case 250:
      return 'fantom';
    case 42161:
      return 'arbitrum-one';
    case 43114:
      return 'avalanche';
    default:
      return null;
  }
}

function getNativeTokenByChainId(chainId) {
  switch (chainId) {
    case 1:
      return 'ethereum';
    case 10:
      return 'ethereum';
    case 56:
      return 'binancecoin';
    case 137:
      return 'matic-network';
    case 250:
      return 'fantom';
    case 42161:
      return 'ethereum';
    case 43114:
      return 'avalanche-2';
    default:
      return null;
  }
}

export const helper = {
  getTokenPrice,
  getNativeTokenPrice,
  getChainByChainId,
  getNativeTokenByChainId,
};
