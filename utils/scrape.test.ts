import { scrape } from "./scrape"

describe('scrape test', () => {
    test('simple case', async () => {
        const result = await scrape('tt1745960')
        expect(result.denominator).toBe('10')
        expect(result.parameter).toContain('K')
    })
})