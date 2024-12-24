# Project Skeleton

![workflow status](https://github.com/csci312-f24/project-cutts/actions/workflows/node.js.yml/badge.svg)

Deployment link: https://cutts.csci312.dev

When the app is launched, users must sign in, so that they can be validated as a member of the school and to have individual profiles.
When users search, they can filter by name, class, or year, so that results are optimized for their purposes.
When users edit profile, they can add people that they have partnered with as references, so that other uses can contact them.
When users select another user, they are able to see their courses, year, major, and past partners that they have added and have been added by.
When users choose to contact to a student, the chat page opens, so that they may begin conversing on the app.
When users have unopened messages, an indicator will appear by the chat icon.

## Creation

This project skeleton has been setup similar to our assignments and practicals. It is a Next.JS application, created with create-next-app `💻 npx create-next-app@latest`, which uses Jest and Testing Library for testing, ESLint for static analysis, Prettier for styling, and is configured to use GitHub actions for testing pull requests.

Development dependencies installed with:

```
💻 npm install -D jest jest-environment-jsdom husky lint-staged prettier eslint-config-prettier @testing-library/react @testing-library/jest-dom cross-env
💻 npx install-peerdeps --dev eslint-config-airbnb
💻 npm install -D eslint-import-resolver-alias
```

Other dependencies installed with:

```
💻 npm install -S prop-types
```

### Additional tools you might need

#### Local and Production database

In order to use the seed files and database, the .env files must be updated to use your specific docker and database URL. Once these
are properly setup, follow these steps to pool
in the seed files:
npx knex migrate: latest
npx knex seed:run

The current database was made with neon, so it is recommended to recreate the tables as seen in
the data section of the code through this site.
If another is used, be aware that there is potential for the need to alter the models.

#### Authenticator

The google authenticator (.env) will also need to be updated to use the ID and Secret code for
the newely created client. See https://console.developers.google.com/apis/credentials to create the credentials.

#### Mocking fetch

Tools for mocking fetch can be installed with

```
💻 npm install -D fetch-mock-jest node-fetch@2.6.7
```

Note we need to pin the `node-fetch` version due to breaking changes when used with Jest in newer versions.
