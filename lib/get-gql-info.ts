import { Alert } from './alerts-flashloan';
import { getTokenData, setupCoins } from './cg-client';
import { getFlashLoans } from './get-flashloans';

export async function getGqlInfo(th: number = 0) {
  await setupCoins();

  let date: Date = new Date();
  let tokens_data = new Map();
  const raw_alerts: Alert[] = await getFlashLoans();
  raw_alerts.forEach((alert) => {
    const tokens = alert.metadata.tokens.split(',');
    tokens.forEach((token, idx) => {
      const prof = parseFloat(alert.metadata.profit);
      if (idx === raw_alerts.length - 1) date = raw_alerts[idx].createdAt;
      if (tokens_data.has(token)) {
        tokens_data.set(token, {
          profit: tokens_data.get(token).profit + prof,
          chainId: alert.source.block.chainId,
          txHash: alert.source.transactionHash,
        });
      } else {
        tokens_data.set(token, {
          profit: prof,
          chainId: alert.source.block.chainId,
          txHash: alert.source.transactionHash,
        });
      }
    });
  });
  //console.log(tokens_data);
  let promises: any = [];
  tokens_data.forEach((value, key) => {
    if (value.profit > th) promises.push(getTokenData(key, value.chainId));
  });
  const token_data = await Promise.all(promises);
  //console.log(JSON.stringify(token_data, null, 2));

  const info = token_data
    .filter((x) => x !== null)
    .map((x) => {
      return {
        address: x.address,
        name: x.coinShortData.name || null,
        symbol: x.coinShortData.symbol || null,
        chain: x.chain,
        chainName: x.chainName,
        profit: tokens_data.get(x.address).profit,
        txHash: tokens_data.get(x.address).txHash,
      };
    });

  return { info, date };
}
