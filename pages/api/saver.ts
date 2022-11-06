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
  // https://app.forta.network/notifications?scopeId=agent|0xf2132d8a18fd24f7ee1398c550fbda06a34633b0e43eb47508c61d6a65e79490&_gl=1*oe643u*_ga*NTUyODk3NDAzLjE2NjY1MjUxMzg.*_ga_3ERDDVRGQQ*MTY2Nzc1NDM4NC4xNC4xLjE2Njc3NTU4MTIuMC4wLjA.
  const prisma = new PrismaClient();
  const data = req.body as FortaWebhook;
  //console.log(data);
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
        profit: parseFloat(JSON.parse(alert.metadata || '{}').profit),
        txHash: alert.source?.transactionHash || '',
        forta_source: JSON.stringify(data),
        chainName: '',
      },
    });
    res.status(200).json(result);
  } catch (ex) {
    console.error(ex);
    res.status(500);
  } finally {
    await prisma.$disconnect();
    res.status(200);
  }
  return res;
}
