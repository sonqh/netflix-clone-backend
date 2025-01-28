import axios, { AxiosResponse } from 'axios'
import InternalServerError from '../errors/internal-server-error'
import BadRequest from '../errors/bad-request'

export const fetchFromTMDB = async <T>(url: string): Promise<T> => {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    throw new InternalServerError('TMDB_ACCESS_TOKEN is not defined')
  }

  const options = {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
    }
  }

  let response: AxiosResponse<T>
  try {
    response = await axios.get<T>(url, options)
  } catch (error) {
    throw new InternalServerError('Failed to fetch data from TMDB: ' + (error as Error).message)
  }

  if (response.status !== 200) {
    throw new BadRequest('Failed to fetch data from TMDB: ' + response.statusText)
  }

  return response.data
}
