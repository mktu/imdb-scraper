// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as playwright from "playwright-aws-lambda";
import { ScrapeError } from '../../../utils/exception';
import { parseRating } from '../../../utils/parser';

const exePath = process.platform === 'win32'
  ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  : process.platform === 'linux'
    ? '/usr/bin/google-chrome'
    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

interface Options {
  args: string[];
  executablePath: string;
  headless: boolean;
}

async function getOptions(isDev: boolean) {
  let options: Options | undefined = undefined;
  if (isDev) {
    options = {
      args: [],
      executablePath: exePath,
      headless: true
    };
  }
  return options;
}

type Data = {
  rate: string,
  denominator: string,
  parameter: string
}

const isDev = !process.env.AWS_REGION;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query as { id: string }
  if (!id) {
    res.status(400).end('id is not set.')
    return
  }
  const options = await getOptions(isDev);
  const browser = await playwright.launchChromium(options)
  const page = await browser.newPage();
  await page.goto(`https://www.imdb.com/title/${id}`);
  const text = await page.locator('[aria-label="View User Ratings"]').first().innerText()
  try {
    const ret = parseRating(text)
    res.status(200).json(ret)
  } catch (e) {
    if (e instanceof ScrapeError) {
      res.status(e.code).end(e.message)
    }
  }
}
