import * as playwright from "playwright-aws-lambda";
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
    const options = await getOptions(isDev);
    const browser = await playwright.launchChromium(options)
    const page = await browser.newPage();
    await page.goto(`https://www.imdb.com/title/${id}`);
    const text = await page.locator('[aria-label="View User Ratings"]').first().innerText()
    return parseRating(text)
}