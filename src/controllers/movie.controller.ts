import { Request, Response, NextFunction } from 'express'
import { fetchFromTMDB } from '../services/tmdb.service'

import NotFoundError from '../errors/not-found'
import { Movie, MovieDetails } from '@plotwist_app/tmdb'
import { Trailer } from '~/types/types'

export async function getTrendingMovie(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await fetchFromTMDB<{ results: Movie[] }>(
      'https://api.themoviedb.org/3/trending/movie/day?language=en-US'
    )

    const randomMovie = data.results[Math.floor(Math.random() * data.results.length)]

    res.json({ success: true, content: randomMovie })
  } catch (error) {
    next(error)
  }
}

export async function getMovieTrailers(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  try {
    const data = await fetchFromTMDB<{ results: Trailer[] }>(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
    )
    res.json({ success: true, trailers: data.results })
  } catch (error) {
    if ((error as Error).message.includes('404')) {
      next(new NotFoundError('Movie not found'))
    } else {
      next(error)
    }
  }
}

export async function getMovieDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  try {
    const data = await fetchFromTMDB<MovieDetails>(`https://api.themoviedb.org/3/movie/${id}?language=en-US`)
    res.status(200).json({ success: true, detail: data })
  } catch (error) {
    if ((error as Error).message.includes('404')) {
      next(new NotFoundError('Movie not found'))
    } else {
      next(error)
    }
  }
}

export async function getSimilarMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  try {
    const data = await fetchFromTMDB<{ results: Movie[] }>(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
    )
    res.status(200).json({ success: true, similar: data.results })
  } catch (error) {
    next(error)
  }
}

export async function getMoviesByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { category } = req.params
  try {
    const data = await fetchFromTMDB<{ results: Movie[] }>(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`
    )
    res.status(200).json({ success: true, content: data.results })
  } catch (error) {
    next(error)
  }
}
