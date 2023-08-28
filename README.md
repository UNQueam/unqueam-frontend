# UNQueam Frontend Project

> This project is the frontend of the gaming platform UNQueam. It is developed with Javascript and Vue as a framework.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- [Node]([https://www.oracle.com/java/technologies/javase-downloads.html](https://nodejs.org/es))

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Contribution

If you'd like to contribute to this project, you're welcome to do so! Open an issue to discuss your ideas or submit a pull request with your proposed changes.

## License

This project is under the [MIT license](LICENSE).
