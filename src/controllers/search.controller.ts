import { Request, Response, NextFunction } from 'express'
import { User } from '../models/user.model.js'
import { fetchFromTMDB } from '../services/tmdb.service.js'

import NotFoundError from '../errors/not-found'
import { MovieWithMediaType, PersonWithMediaType, TvSerieWithMediaType } from '@plotwist_app/tmdb'

export async function searchPerson(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { query } = req.params
  try {
    const response: { results: PersonWithMediaType[] } = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    )

    if (response.results.length === 0) {
      throw new NotFoundError('Person not found')
    }

    // TODO: TMDB API does not have a get details endpoint for people, so we can't get the full details of a person
    const person = response.results[0]

    const existingEntry = await User.findOne({
      _id: req.user._id,
      'searchHistory.id': person.id,
      'searchHistory.searchType': 'person'
    })

    if (existingEntry) {
      await User.updateOne(
        {
          _id: req.user._id,
          'searchHistory.id': person.id,
          'searchHistory.searchType': 'person'
        },
        {
          $set: {
            'searchHistory.$.createdAt': new Date()
          }
        }
      )
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            id: person.id,
            image: person.profile_path,
            title: person.name,
            searchType: 'person',
            createdAt: new Date()
          }
        }
      })
    }

    res.status(200).json({ success: true, content: response.results })
  } catch (error) {
    next(error)
  }
}

export async function searchMovie(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { query } = req.params

  try {
    const response: { results: MovieWithMediaType[] } = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    )

    if (response.results.length === 0) {
      throw new NotFoundError('Movie not found')
    }

    res.status(200).json({ success: true, content: response.results })
  } catch (error) {
    next(error)
  }
}

export async function searchTv(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { query } = req.params

  try {
    const response: { results: TvSerieWithMediaType[] } = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    )

    if (response.results.length === 0) {
      throw new NotFoundError('TV show not found')
    }

    res.json({ success: true, content: response.results })
  } catch (error) {
    next(error)
  }
}

export async function getSearchHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json({ success: true, content: req.user.searchHistory })
  } catch (error) {
    next(error)
  }
}

export async function removeItemFromSearchHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
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
    next(error)
  }
}
