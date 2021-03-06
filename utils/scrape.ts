import * as playwright from "playwright-aws-lambda";
import { ScrapeError } from "./exception";
import { parseRating } from "./parser";

const exePath = process.platform === 'win32'
    ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    : process.platform === 'linux'
        ? '/usr/bin/google-chrome'
        : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const isDev = !process.env.AWS_REGION;

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

export const scrape = async (id: string) => {
    const start = Date.now()
    const options = await getOptions(isDev);
    const browser = await playwright.launchChromium({ ...options })
    try {
        console.log(`-- launch chronium : ${(Date.now() - start) / 1000}sec`)
        const page = await browser.newPage({
            javaScriptEnabled: false
        });
        console.log(`-- new page : ${(Date.now() - start) / 1000}sec`)
        const ret = await page.goto(`https://www.imdb.com/title/${id}`)
        if (ret?.status() !== 200) {
            throw new ScrapeError(`${id} is not found`, ret ? ret.status() : 404)
        }
        console.log(`-- goto page : ${(Date.now() - start) / 1000}sec`)
        const text = await page.locator('[aria-label="View User Ratings"]').first().innerText()
        console.log(`-- locate : ${(Date.now() - start) / 1000}sec`)
        const parsed = parseRating(text)
        console.log(`-- parse : ${(Date.now() - start) / 1000}sec`)
        return parsed
    } catch (e) {
        console.log(e instanceof ScrapeError)
        throw e
    } finally {
        await browser.close()
    }
}