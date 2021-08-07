// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio';
import populationData from '../../country-data.json'

type Data = {
  name: string
}

type populationDataType = {
  name: string,
  flag: string,
  population: number
} | undefined

export type CountryData = {
  name: string,
  gold: number,
  silver: number,
  bronze: number,
  total: number,
  perCapita: number | string | undefined,
  population: number | undefined,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const response = await fetch(
    'https://olympics.com/tokyo-2020/olympic-games/en/results/all-sports/medal-standings.htm'
  )
  const html = await response.text()
  const $ = cheerio.load(html);
  // const table = $('tbody').text()
  const scrapedData: CountryData[]  = [];
  $('#medal-standing #medal-standing-table > tbody tr').each((index, element) => {
    const tds = $(element).find('td');
    const name = $(tds[1]).data('text') as string
    const gold =  Number($(tds[2]).find('a').text().replace(/\n/, ''))
    const silver =  Number($(tds[3]).find('a').text().replace(/\n/, ''))
    const bronze =  Number($(tds[4]).find('a').text().replace(/\n/, ''))
    const total =  Number($(tds[5]).find('a').text().replace(/\n/, ''))

    const countryPop: populationDataType = populationData.find(({olympicName: countryName}) => {
      return countryName.includes(name)
    })
    const perCapita = countryPop ? (total / countryPop?.population).toFixed(10) : '0'

    const data = {
      name,
      gold,
      silver,
      bronze,
      total,
      perCapita,
      population: countryPop?.population
    }
    scrapedData.push(data);
  })

  const returnData: CountryData[]  = scrapedData.sort((a, b) => {
    return b.perCapita - a.perCapita;
  })

  res.status(200).json({ data: returnData })
}
