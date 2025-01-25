import { Request, Response } from 'express'
import { fetchFromTMDB } from '../services/tmdb.service'
import { Movie, Video, MovieDetails } from 'tmdb-ts'
import ApplicationError from '../errors/application-error'
import NotFoundError from '../errors/not-found'
import InternalServerError from '../errors/internal-server-error'

export async function getTrendingMovie(req: Request, res: Response): Promise<void> {
  try {
    const data = await fetchFromTMDB<{ results: Movie[] }>(
      'https://api.themoviedb.org/3/trending/movie/day?language=en-US'
    )

    const randomMovie = data.results[Math.floor(Math.random() * data.results.length)]

    res.json({ success: true, content: randomMovie })
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in getTrendingMovie controller', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function getMovieTrailers(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const data = await fetchFromTMDB<{ results: Video[] }>(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
    )
    res.json({ success: true, trailers: data.results })
  } catch (error) {
    if ((error as Error).message.includes('404')) {
      throw new NotFoundError('Movie not found')
    }

    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in getMovieTrailers controller', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function getMovieDetails(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const data = await fetchFromTMDB<MovieDetails>(`https://api.themoviedb.org/3/movie/${id}?language=en-US`)
    res.status(200).json({ success: true, content: data })
  } catch (error) {
    if ((error as Error).message.includes('404')) {
      throw new NotFoundError('Movie not found')
    }

    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in getMovieDetails controller', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function getSimilarMovies(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const data = await fetchFromTMDB<{ results: Movie[] }>(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
    )
    res.status(200).json({ success: true, similar: data.results })
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in getSimilarMovies controller', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function getMoviesByCategory(req: Request, res: Response): Promise<void> {
  const { category } = req.params
  try {
    const data = await fetchFromTMDB<{ results: Movie[] }>(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`
    )
    res.status(200).json({ success: true, content: data.results })
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in getMoviesByCategory controller', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}
