import express from 'express'
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import dotenvConfig from '~/config/dotenv.config'

dotenvConfig.config()

const docRouter = express.Router()

const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }'
}

const SWAGGER_YAML_FILEPATH = path.resolve(process.cwd(), 'openapi.yml')
console.log('swagger yaml file path:', SWAGGER_YAML_FILEPATH)
if (process.env.NODE_ENV === 'development') {
  console.log('Setting up Swagger UI in development mode')

  const swaggerYaml = yaml.load(fs.readFileSync(SWAGGER_YAML_FILEPATH, 'utf8')) as object
  docRouter.use('/api-docs', swaggerUi.serve)
  docRouter.get('/api-docs', swaggerUi.setup(swaggerYaml, swaggerUiOptions) as express.RequestHandler)
}

export default docRouter
