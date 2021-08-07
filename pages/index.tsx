import { useEffect, useState } from 'react'
import { countryData } from './api/getCountryData'

export default function Home() {
  const [countryData, setCountryData] = useState<countryData[]>([])

  useEffect(() => {
      getTheData()
  }, [])

  const getTheData = async () => {
    const response = await fetch('/api/getCountryData')
    const responseData = await response.json()
    setCountryData(responseData.data)
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Country Name</th>
          <th>Golds</th>
          <th>Silvers</th>
          <th>Bronze</th>
          <th>Total</th>
          <th>Per Capita</th>
          <th>Population</th>
        </tr>
      </thead>
      <tbody>
        {countryData?.map((country, idx) => {
          return (
            <tr key={country.name}>
              <td>{idx + 1}</td>
              <td>{country.name}</td>
              <td>{country.gold}</td>
              <td>{country.silver}</td>
              <td>{country.bronze}</td>
              <td>{country.total}</td>
              <td>{country.perCapita}</td>
              <td>{country.population}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
