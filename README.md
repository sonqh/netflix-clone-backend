# Netflix Clone

A Netflix clone built with Node.js, Express, TypeScript, and Docker. This project aims to replicate the core functionalities of Netflix, including user authentication, movie and TV show browsing, and search capabilities. It leverages The Movie Database (TMDB) API to fetch movie and TV show data.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Docker](#docker)
- [Testing](#testing)
- [Linting and Formatting](#linting-and-formatting)
- [Configuration](#configuration)
- [Safe Mongoose Connection](#safe-mongoose-connection)
- [Cache](#cache)
- [Rate Limiting](#rate-limiting)
- [License](#license)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/netflix-clone.git
   cd netflix-clone
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Copy the example environment file and update the environment variables:
   ```sh
   cp .env.example .env
   ```

## Usage

To start the development server, run:

```sh
npm run dev
```

## Docker

### Development

To build and run the Docker container for development, use the following commands:

1. Build and start the Docker containers:
   ```sh
   docker compose -f docker-compose.dev.yml up -d
   ```

The MongoDB service will be available at `mongodb://localhost:27017`.

### Production

To build and run the Docker container for production, use the following commands:

1. Build the Docker image:

   ```sh
   docker-compose build
   ```

2. Start the Docker container:
   ```sh
   docker-compose up -d
   ```

The application will be available at `http://localhost:3000`.

## Testing

To run tests, use the following command:

```sh
npm test
```

## Linting and Formatting

To lint the code, use:

```sh
npm run lint
```

To fix linting issues, use:

```sh
npm run lint:fix
```

To check code formatting, use:

```sh
npm run prettier
```

To fix code formatting, use:

```sh
npm run prettier:fix
```

## Configuration

### Eslint

The ESLint configuration is defined in the `eslint.config.mjs` file.

### Prettier

The Prettier configuration is defined in the `prettier.config.mjs` file.

### Jest

The Jest configuration is defined in the `jest.config.js` file.

### Environment Variables

The environment variables are configured using the `dotenv.config.ts` file.

### Express

The Express configuration is defined in the `express.config.ts` file.

### Redis

The Redis configuration is defined in the `redis.config.ts` file.

### Commitlint

The Commitlint configuration is defined in the `commitlint.config.js` file.

### Routes

- **Auth Routes**: Defined in `auth.route.ts`
- **Movie Routes**: Defined in `movie.route.ts`
- **TV Routes**: Defined in `tv.route.ts`
- **Search Routes**: Defined in `search.route.ts`
- **Documentation Routes**: Defined in `doc.route.ts`
- **Cache Routes**: Defined in `cache.route.ts`

### Middleware

- **Protect Route Middleware**: Defined in `protect-route.middleware.ts`
- **Cache Middleware**: Defined in `cache.middleware.ts`
- **Rate Limit Middleware**: Defined in `rate-limit.middleware.ts`

## Safe Mongoose Connection

The `SafeMongooseConnection` class is a wrapper to help manage MongoDB connections using Mongoose. It handles automatic reconnection attempts and provides hooks for connection events.

### Usage

To use the `SafeMongooseConnection`, import it and create an instance with the required options:

```typescript
import SafeMongooseConnection from './path/to/safe-mongoose-connection'

const mongoConnection = new SafeMongooseConnection({
  mongoUrl: 'your-mongo-url',
  retryDelayMs: 2000,
  onStartConnection: (url) => console.log(`Connecting to ${url}`),
  onConnectionError: (error, url) => console.error(`Error connecting to ${url}:`, error),
  onConnectionRetry: (url) => console.log(`Retrying connection to ${url}`)
})

mongoConnection.connect((url) => {
  console.log(`Connected to ${url}`)
})
```

### Options

- `mongoUrl`: The MongoDB connection string.
- `mongooseConnectionOptions`: Optional Mongoose connection options.
- `retryDelayMs`: Optional delay between reconnection attempts (default is 2000ms).
- `debugCallback`: Optional callback for Mongoose debug logs.
- `onStartConnection`: Optional callback when starting a connection.
- `onConnectionError`: Optional callback for connection errors.
- `onConnectionRetry`: Optional callback for connection retries.

### Methods

- `connect(onConnectedCallback)`: Starts the connection process and calls `onConnectedCallback` when connected.
- `close(force)`: Closes the MongoDB connection.

### Events

- `onConnected`: Called when the connection is established.
- `onReconnected`: Called when the connection is re-established after a disconnection.
- `onError`: Called when there is a connection error.
- `onDisconnected`: Called when the connection is lost.

## Cache

The application uses Redis for caching to improve performance and reduce the load on the database. The cache middleware checks for cached data before processing a request.

### Usage

To use the cache middleware, import it and apply it to your routes:

```typescript
import { checkCache } from './middleware/cache.middleware'

app.use('/your-route', checkCache('yourCacheKey'))
```

### Configuration

The Redis configuration is defined in the `redis.config.ts` file.

## Rate Limiting

The application uses rate limiting to prevent abuse and ensure fair usage of the API. The rate limit middleware restricts the number of requests a client can make in a given time window.

### Usage

To use the rate limit middleware, import it and apply it to your routes:

```typescript
import rateLimitMiddleware from './middleware/rate-limit.middleware'

app.use(rateLimitMiddleware)
```

### Configuration

The rate limit configuration is defined in the `rate-limit.middleware.ts` file.

## License

This project is licensed under the MIT License.
