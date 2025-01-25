import express from 'express'
import {
  getSearchHistory,
  removeItemFromSearchHistory,
  searchMovie,
  searchPerson,
  searchTv
} from '~/controllers/search.controller'

const searchRouter = express.Router()

searchRouter.get('/person/:query', searchPerson)
searchRouter.get('/movie/:query', searchMovie)
searchRouter.get('/tv/:query', searchTv)
searchRouter.get('/history', getSearchHistory)

searchRouter.delete('/history/:id', removeItemFromSearchHistory)

export default searchRouter
