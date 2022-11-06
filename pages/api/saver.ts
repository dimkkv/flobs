// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { FortaWebhook } from 'lib/forta-webhook';
import { getTokenData } from 'lib/cg-client';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  console.log(req.body);
  const prisma = new PrismaClient();
  const data = req.body as FortaWebhook;
  console.log(data);
  if (!data || !data.alerts || data?.alerts?.length === 0) {
    res.status(500);
    return;
  }
  const alert = data.alerts[0];
  const tokens = JSON.parse(alert.metadata || '{}').tokens.split(',');
  const tokens_info = await Promise.all(
    tokens.map(async (token) =>
      getTokenData(token, alert.source?.block?.chainId)
    )
  );
  try {
    const result = await prisma.flashLoan.create({
      data: {
        assets: tokens,
        assets_info: JSON.stringify(tokens_info),
        chainId: alert.source?.block?.chainId || -1,
        profit: JSON.parse(alert.metadata || '{}').profit,
        txHash: alert.source?.transactionHash || '',
        forta_source: JSON.stringify(data),
      },
    });
    res.status(200).json(result);
  } catch (ex) {
    console.error(ex);
  } finally {
    await prisma.$disconnect();
  }

  res.status(200);
}
