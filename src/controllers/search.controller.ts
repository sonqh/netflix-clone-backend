import { Request, Response } from 'express'
import { User } from '../models/user.model.js'
import { fetchFromTMDB } from '../services/tmdb.service.js'
import { PersonWithMediaType, MovieWithMediaType, TVWithMediaType } from 'tmdb-ts'
import ApplicationError from '../errors/application-error'
import NotFoundError from '../errors/not-found'
import InternalServerError from '../errors/internal-server-error'

export async function searchPerson(req: Request, res: Response): Promise<void> {
  const { query } = req.params
  try {
    const response: { results: PersonWithMediaType[] } = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    )

    if (response.results.length === 0) {
      throw new NotFoundError('Person not found')
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].profile_path,
          title: response.results[0].name,
          searchType: 'person',
          createdAt: new Date()
        }
      }
    })

    res.status(200).json({ success: true, content: response.results })
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in searchPerson controller: ', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function searchMovie(req: Request, res: Response): Promise<void> {
  const { query } = req.params

  try {
    const response: { results: MovieWithMediaType[] } = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    )

    if (response.results.length === 0) {
      throw new NotFoundError('Movie not found')
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].poster_path,
          title: response.results[0].title,
          searchType: 'movie',
          createdAt: new Date()
        }
      }
    })
    res.status(200).json({ success: true, content: response.results })
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in searchMovie controller: ', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function searchTv(req: Request, res: Response): Promise<void> {
  const { query } = req.params

  try {
    const response: { results: TVWithMediaType[] } = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    )

    if (response.results.length === 0) {
      throw new NotFoundError('TV show not found')
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].poster_path,
          title: response.results[0].name,
          searchType: 'tv',
          createdAt: new Date()
        }
      }
    })
    res.json({ success: true, content: response.results })
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in searchTv controller: ', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function getSearchHistory(req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json({ success: true, content: req.user.searchHistory })
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in getSearchHistory controller: ', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function removeItemFromSearchHistory(req: Request, res: Response): Promise<void> {
  const { id } = req.params

  const parsedId = parseInt(id)

  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        searchHistory: { id: parsedId }
      }
    })

    res.status(200).json({ success: true, message: 'Item removed from search history' })
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in removeItemFromSearchHistory controller: ', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}
