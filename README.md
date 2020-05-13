<p align="center">![Ceph](https://i2.wp.com/ceph.io/wp-content/uploads/2016/07/Ceph_Logo_Standard_RGB_120411_fa.png?resize=322%2C148&ssl=1)</p>

# ceph.io

Static website for [ceph.io](https://ceph.io). Built with [Eleventy](https://www.11ty.dev).

## Requirements

- [**Node.js**](https://nodejs.org/en/) v14.2.0 (includes **npm** v6.14.4)

Earlier versions of Node and npm will also work, but we recommend using these versions for consistency between builds and environments.

We use [`nvm`](https://github.com/nvm-sh/nvm) to manage Node versions when working locally, and run the `nvm use` command before getting started in development.

## Getting started

### Install

```
$ npm install
```

Install all dependencies, as specified in `package.json`. The majority of these are `devDependencies`, which cover any packages used during development and build processes. Packages installed as `dependencies` are those intended to be shipped to end-users as part of the built product.

### Learn more

Eleventy is a simple static site generator built on Node.js. It's a fast and flexible alternative to Jekyll and Hugo, and sits nicely alongside modern web projects. Visit the [Eleventy docs](https://www.11ty.dev/docs/) for detailed feature information and example projects. 

## Local development

```
$ npm start
```

Serve the site in development mode at `localhost:8080`, watching for changes. The site will automatically rebuild and refresh when files change.

Under the hood, this is running Eleventy with the `--serve` flag. For more information, see [Command line usage](https://www.11ty.dev/docs/usage/) docs.

## Build for production

```
$ npm run build
```

Build the site for production. This will build, optimise and generate a complete build package for deployment on any static web host.

Files are output to the `dist` directory, which is excluded from version control.

## Debugging

```
$ npm run debug
```

Run a build with a verbose log of information on files and data being processed. This can be helpful for troubleshooting issues during development or when deploying via CI.

More information is available in the [Debugging](https://www.11ty.dev/docs/debugging/) docs.


## Deployment

[TBC]