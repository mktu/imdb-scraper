import axios from "axios"
import { parse } from 'node-html-parser'
import { ScrapeError } from './exception'
import { parseRating } from './parser'

export const scrape = async (id: string) => {
    const start = Date.now()
    let res = null
    try {
        res = await axios.get(`https://www.imdb.com/title/${id}`)
    } catch (e) {
        console.error(e)
        throw new ScrapeError(`cannnot open page for ${id}`, 404)
    }
    if (res?.status !== 200) {
        throw new ScrapeError(`${id} is not found`, res?.status || 404)
    }
    console.log(`-- fetch page : ${(Date.now() - start) / 1000}sec`)
    const body = res.data
    console.log(`-- get body : ${(Date.now() - start) / 1000}sec`)
    const root = parse(body)
    console.log(`-- parse body : ${(Date.now() - start) / 1000}sec`)
    const text = root.querySelector('[aria-label="View User Ratings"]')?.firstChild.innerText
    if (!text) {
        throw new ScrapeError(`cannnot scrape ${id}`, 500)
    }
    return parseRating(text)
}