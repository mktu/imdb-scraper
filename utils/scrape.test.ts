import { ScrapeError } from "./exception"
import { scrape } from "./scrape"

describe('scraping test', () => {
    test('success test', async () => {
        const result = await scrape('tt1745960')
        expect(result.denominator).toBe('10')
        expect(result.parameter).toContain('K')
    }, 10000)
    test('fail test', async () => {
        try {
            await scrape('91')
            expect(true).toBe(false)
        } catch (e: any) {
            if (!(e instanceof ScrapeError)) {
                expect(true).toBe(false)
            }
        }
    }, 10000)
})