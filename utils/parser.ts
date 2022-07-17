import { ScrapeError } from "./exception"

export const parseRating = (text: string) => {
    const matcher = /(\d+\.?\d*[A-Z]|\d+\.?\d*)/gm
    const values = text.match(matcher)
    if (!values || values?.length !== 3) {
        throw new ScrapeError('regex parse error', 500)
    }
    return {
        rate: values[0],
        denominator: values[1],
        parameter: values[2]
    }
}