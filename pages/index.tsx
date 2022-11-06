import Head from 'next/head';
import Image from 'next/image';

import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from 'chart.js';
import { Chart, getElementAtEvent } from 'react-chartjs-2';
import moment from 'moment';
import { useRef } from 'react';
import axios from 'axios';
import { utils } from 'lib/utils';
import { FlResponse } from 'lib/flobs';
import { getGqlInfo } from 'lib/get-gql-info';

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
);

const Home = ({ info: i }) => {
  const { info: inf, date } = i;
  const info = inf as FlResponse[];
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
    //console.log(data[0].index);
    try {
      const item = info[data[0].index];
      window.open(
        utils.getTenderlyContractUrl(item.chain, item.address),
        '_blank'
      );
    } catch (error) {}
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <Head>
        <title>Flobs | Flashloan observer</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div></div>
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
  const { info: inf, date } = await getGqlInfo(30);
  const info = inf as FlResponse[];
  return {
    props: {
      info: { info: info, date: moment(date).format('MMMM Do YYYY hh:mm:ss') },
    },
    revalidate: 360,
  };
}

export default Home;
