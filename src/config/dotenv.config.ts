import dotenv from 'dotenv'

export default {
  config: () => {
    const result = dotenv.config()
    if (result.error) {
      dotenv.config({ path: '.env.default' })
    }
  }
}
