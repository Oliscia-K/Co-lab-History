# Co-lab-History
Began as a software dev final project with plans to expand outside of the course. This is meant to be used by students to connect to each other for project-partner interests
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

#### Mocking fetch

Tools for mocking fetch can be installed with

```
💻 npm install -D fetch-mock-jest node-fetch@2.6.7
```

Note we need to pin the `node-fetch` version due to breaking changes when used with Jest in newer versions.
