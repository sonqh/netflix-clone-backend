export type Trailer = {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}

export type SearchResults<T> = {
  success: boolean
  results: T[]
  total_results: number
}
