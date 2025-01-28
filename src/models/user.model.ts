import mongoose, { Document, Schema } from 'mongoose'

interface ISearchHistoryItem {
  id: number
  image: string
  title: string
  searchType: 'person' | 'movie' | 'tv'
  createdAt: Date
}

interface IUser extends Document {
  username: string
  email: string
  password: string
  image?: string
  searchHistory?: ISearchHistoryItem[]
}

const SearchHistoryItemSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  searchType: {
    type: String,
    enum: ['person', 'movie', 'tv'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  searchHistory: {
    type: [SearchHistoryItemSchema],
    default: []
  }
})

export const User = mongoose.model<IUser>('User', userSchema)
