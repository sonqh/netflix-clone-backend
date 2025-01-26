import { Request, Response, NextFunction } from 'express'
import { fetchFromTMDB } from '../services/tmdb.service.js'
import { TVWithMediaType, Video, TV } from 'tmdb-ts'
import NotFoundError from '../errors/not-found'

export async function getTrendingTv(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data: { results: TVWithMediaType[] } = await fetchFromTMDB(
      'https://api.themoviedb.org/3/trending/tv/day?language=en-US'
    )
    const randomMovie = data.results[Math.floor(Math.random() * data.results.length)]

    res.json({ success: true, content: randomMovie })
  } catch (error) {
    next(error)
  }
}

export async function getTvTrailers(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  try {
    const data: { results: Video[] } = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`
    )
    res.json({ success: true, trailers: data.results })
  } catch (error) {
    if ((error as Error).message.includes('404')) {
      next(new NotFoundError('TV show not found'))
    } else {
      next(error)
    }
  }
}

export async function getTvDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  try {
    const data: TV = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`)
    res.status(200).json({ success: true, content: data })
  } catch (error) {
    if ((error as Error).message.includes('404')) {
      next(new NotFoundError('TV show not found'))
    } else {
      next(error)
    }
  }
}

export async function getSimilarTvs(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  try {
    const data: { results: TV[] } = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`
    )
    res.status(200).json({ success: true, similar: data.results })
  } catch (error) {
    next(error)
  }
}

export async function getTvsByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { category } = req.params
  try {
    const data: { results: TV[] } = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`
    )
    res.status(200).json({ success: true, content: data.results })
  } catch (error) {
    next(error)
  }
}
