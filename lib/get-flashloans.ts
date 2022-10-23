import { Alert, Flashloans } from './alerts-flashloan';
import { getClient } from './apollo-client';
import { apolloQueries } from './apollo-queries';

let result: Alert[] = [];
let count = 0;
const limit = 100;

export async function getFlashLoans(blockNumber?, alertId?): Promise<Alert[]> {
  const client = getClient();
  const data = await client.query(
    apolloQueries.recentAlertsFromFlashLoanDetector(blockNumber, alertId)
  );
  const typedData = data as Flashloans;
  let result = typedData.data.alerts.alerts;
  console.log(`Got ${result.length} results`);
  console.log('hasNextPage', typedData.data.alerts.pageInfo.hasNextPage);
  if (typedData.data.alerts.pageInfo.hasNextPage && count < limit) {
    const alerts = await getFlashLoans(
      typedData.data.alerts.pageInfo.endCursor.alertId,
      typedData.data.alerts.pageInfo.endCursor.blockNumber
    );
    count++;
    console.log('count', count);
    result = result.concat(alerts);
  }
  console.log('result', result.length);
  return result;
}
