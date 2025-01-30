import express from 'express'
import {
  getSimilarTvs,
  getTrendingTv,
  getTvDetails,
  getTvsByCategory,
  getTvTrailers
} from '~/controllers/tv.controller'

const tvRouter = express.Router()

tvRouter.get('/trending', getTrendingTv)
tvRouter.get('/:id/trailers', getTvTrailers)
tvRouter.get('/:id/details', getTvDetails)
tvRouter.get('/:id/similar', getSimilarTvs)
tvRouter.get('/:category', getTvsByCategory)

export default tvRouter
