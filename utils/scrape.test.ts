import { scrape } from "./scrape"

test('scrape test', async () => {
    const result = await scrape('tt1745960')
    expect(result.denominator).toBe('10')
    expect(result.parameter).toContain('K')
}, 10000)