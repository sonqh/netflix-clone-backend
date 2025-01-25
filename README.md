# Netflix Clone

A Netflix clone built with Node.js, Express, TypeScript, and Docker.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Docker](#docker)
- [Testing](#testing)
- [Linting and Formatting](#linting-and-formatting)
- [Configuration](#configuration)
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

The Prettier configuration is defined in the `.prettie.config.mjs` file.

### Jest

The Jest configuration is defined in the `jest.config.js` file.
