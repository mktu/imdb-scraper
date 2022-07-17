// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { ScrapeError } from '../../../utils/exception';
import { scrape } from '../../../utils/scrape';

type Data = {
  rate: string,
  denominator: string,
  parameter: string
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query as { id: string }
  if (!id) {
    res.status(400).end('id is not set.')
    return
  }
  try {
    const ret = await scrape(id)
    res.status(200).json(ret)
  } catch (e) {
    if (e instanceof ScrapeError) {
      res.status(e.code).end(e.message)
      return
    }
    console.error(e)
    res.status(500).end('server error')
  }
}
