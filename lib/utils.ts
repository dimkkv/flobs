export const utils = {
  api_url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  numberWithCommas: (x) => {
    return x.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  getTenderlyTxUrl: (chainId, txHash) => {
    const url = tenderlyTxUrl + getTenderlyStab(chainId) + '/' + txHash;
    return url;
  },

  getTenderlyContractUrl(chainId, address) {
    const url = tenderlyContractUrl + getTenderlyStab(chainId) + '/' + address;
    return url;
  },
};

const tenderlyDashboardUrl = 'https://dashboard.tenderly.co';
const tenderlyTxUrl = `${tenderlyDashboardUrl}/tx/`;
const tenderlyContractUrl = `${tenderlyDashboardUrl}/contract/`;
const getTenderlyStab = (chainId) => {
  switch (chainId) {
    case 1:
      return `mainnet`;
    case 137:
      return `polygon`;
    case 56:
      return `binance`;
    default:
      break;
  }
};
