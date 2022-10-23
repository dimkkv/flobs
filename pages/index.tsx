import { gql } from '@apollo/client';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Alert, Alerts } from '../lib/alerts-flashloan';
import { getTokenData, setupCoins } from '../lib/cg-client';
import { getFlashLoans } from '../lib/get-flashloans';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart, getElementAtEvent } from 'react-chartjs-2';
import moment from 'moment';
import { useRef } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = ({ info: i }) => {
  const { info, date } = i;
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Flash Loan Volume by Asset from (${date}) to this moment, in USD > 30$`,
      },
      tooltip: {
        callbacks: {
          afterBody: (tooltipItem) => {
            console.log(tooltipItem);
            const { dataIndex: index } = tooltipItem[0];
            const item = info[index];

            return `Address: ${item.address} \n ChainName: ${item.chainName} \n Symbol: ${item.symbol}`;
          },
        },
      },
    },
  };

  const data = {
    labels: info.map((i) => i.name),
    datasets: [
      {
        label: 'usd volume',
        data: info.map((i) => i.profit),
        meta: info,
      },
    ],
  };

  const chartRef = useRef<ChartJS>(null);

  const onClick = (event: any) => {
    const { current: chart } = chartRef;

    if (!chart) {
      return;
    }

    const data = getElementAtEvent(chart, event);
    console.log(data[0].index);
    const item = info[data[0].index];
    window.open(`https://www.coingecko.com/en/coins/${item.symbol}`, '_blank');
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <Head>
        <title>Flobs | Flashloan observer</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Chart
        type='bar'
        options={options}
        data={data}
        ref={chartRef}
        onClick={onClick}
      />

      <footer className='flex h-24 w-full items-center justify-center border-t'>
        <a
          className='flex items-center justify-center gap-2'
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'>
          Powered by{' '}
          <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
        </a>
      </footer>
    </div>
  );
};

export async function getStaticProps() {
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
        });
      } else {
        tokens_data.set(token, {
          profit: prof,
          chainId: alert.source.block.chainId,
        });
      }
    });
  });
  //console.log(tokens_data);
  let promises: any = [];
  tokens_data.forEach((value, key) => {
    if (value.profit > 30) promises.push(getTokenData(key, value.chainId));
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
      };
    });

  return {
    props: {
      info: { info: info, date: moment(date).format('MMMM Do YYYY hh:mm:ss') },
    },
  };
}

export default Home;
