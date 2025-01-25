import { Request, Response } from 'express'
import { fetchFromTMDB } from '../services/tmdb.service.js'
import { TVWithMediaType, Video, TV } from 'tmdb-ts'
import ApplicationError from '../errors/application-error'
import NotFoundError from '../errors/not-found'
import InternalServerError from '../errors/internal-server-error'

export async function getTrendingTv(req: Request, res: Response): Promise<void> {
  try {
    const data: { results: TVWithMediaType[] } = await fetchFromTMDB(
      'https://api.themoviedb.org/3/trending/tv/day?language=en-US'
    )
    const randomMovie = data.results[Math.floor(Math.random() * data.results.length)]

    res.json({ success: true, content: randomMovie })
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in getTrendingTv controller', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function getTvTrailers(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const data: { results: Video[] } = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`
    )
    res.json({ success: true, trailers: data.results })
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      throw new NotFoundError('TV show not found')
    }

    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in getTvTrailers controller', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function getTvDetails(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const data: TV = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`)
    res.status(200).json({ success: true, content: data })
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      throw new NotFoundError('TV show not found')
    }

    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in getTvDetails controller', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function getSimilarTvs(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const data: { results: TV[] } = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`
    )
    res.status(200).json({ success: true, similar: data.results })
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in getSimilarTvs controller', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function getTvsByCategory(req: Request, res: Response): Promise<void> {
  const { category } = req.params
  try {
    const data: { results: TV[] } = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`
    )
    res.status(200).json({ success: true, content: data.results })
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in getTvsByCategory controller', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}
