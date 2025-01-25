import express from 'express'
import {
  getMovieDetails,
  getMoviesByCategory,
  getMovieTrailers,
  getSimilarMovies,
  getTrendingMovie
} from '~/controllers/movie.controller'

const movieRouter = express.Router()

movieRouter.get('/trending', getTrendingMovie)
movieRouter.get('/:id/trailers', getMovieTrailers)
movieRouter.get('/:id/details', getMovieDetails)
movieRouter.get('/:id/similar', getSimilarMovies)
movieRouter.get('/:category', getMoviesByCategory)

export default movieRouter
