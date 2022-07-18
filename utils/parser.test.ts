import { parseRating } from "./parser"

describe('parse rating', () => {
    test('tc1', () => {
        const result = parseRating('8.6/10432M')
        expect(result.rate).toBe('8.6')
        expect(result.denominator).toBe('10')
        expect(result.parameter).toBe('432M')
    })
    test('tc2', () => {
        const result = parseRating('0/100')
        expect(result.rate).toBe('0')
        expect(result.denominator).toBe('10')
        expect(result.parameter).toBe('0')
    })
    test('tc3', () => {
        const result = parseRating('8.0/10432K')
        expect(result.rate).toBe('8.0')
        expect(result.denominator).toBe('10')
        expect(result.parameter).toBe('432K')
    })
})