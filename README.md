<p align="center"><img src="https://ceph.io/assets/bitmaps/Ceph_Logo_Standard_RGB_120411_fa.png?resize=322%2C148&ssl=1" alt="Ceph" /></p>

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

:warning: **Important to note:** The `npm run build` action is intended for the build server and production environment only. Building the site isn't necessary during development. In the future when there are multiple languages running a build will also initiate [`scripts/prebuild.js`](https://github.com/ceph/ceph.io/blob/develop/scripts/images.js), which is responsible for duplicating any missing pages from the default language site (`en`) to all supporting language sites (as determined by the `_data/locales`). This additional script ensures that we have content parity across all sites in production, falling back to English where content is not available. The files generated across the supporting language site directories should not be committed to version control.

## Debugging

```
$ npm run debug
```

Run a build with a verbose log of information on files and data being processed. This can be helpful for troubleshooting issues during development or when deploying via CI.

More information is available in the [Debugging](https://www.11ty.dev/docs/debugging/) docs.

## Deployment

[TBC]

## Authoring pages

### Page data

At the beginning of all pages, there's a block of data wrapped with ---. This is called frontmatter and it will follow a specific schema relative to the page you are on.

The frontmatter data is written in [YAML format](https://yaml.org/) using `key: value` pairs.

### Markdown and HTML

Pages can contain a mix of Markdown and HTML. This means we can intersperse basic content formatting with more bespoke HTML elements in the same file.

```
# Page title

A paragraph of text, Markdown style.

- Markdown list items
- Lists are great

<article class="bespoke">
  <h2>Stick to HTML</h2>
</article>
```

The **caveat** here is to ensure that there is always a clear break between Markdown and HTML elements. Mixing and matching the two in a single content block will not work.

```
<!-- This won't work -->
<article>
  ## Trying for a Markdown heading (and failing)
</article>

<!-- This will -->
<article>

## All good here

</article>
```

To learn more about what's possible in Markdown, see [Markdown Guide](https://www.markdownguide.org).

### Adding links

Linking to pages throughout the site works in the same way as linking to pages in standard HTML sites.

We'll most likely be using Markdown's link syntax to link to pages. The links we choose can be relative or absolute.

Let's use a _blog-posts_ page (`/blog/yyyy/blog-post`) as an example. If we want to link to another blog post page it can be done in two ways:

```md
[Relative link to blog post](../blog-post/)

[Root relative link to blog post](/blog/yyyy/blog-post/)
```

If we need to link to another section/page within the site we can use either method shown above. The `../` prefix can be used to traverse further up the site tree:

```md
[Relative link to my parent](../)
[Relative link to my grandparent](../../)
[Relative link to a sibling of mine](../sibling-page/)
```

Note: these don't need filename `.md`/`.html` extensions.

Only use absolute URLs for links out of the site:

```md
[Absolute link to Ceph.io](https://ceph.io/)
```

### Dynamic values

We can interpolate these dynamic values throughout the Markdown. For example, we can save ourselves repeating the page's `title` property for our page title heading by using the `{{ }}` syntax:

```md
---
title: Don't repeat yourself
---

# Don't repeat yourself
```

becomes:

```md
---
title: Don't repeat yourself
---

# {{ title }}
```

### Shortcodes

Shortcodes are reusable code snippets that allow us to sweep away complicated markup into a nice, easy user interface.

#### YouTube video player embed

```
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/vQF17UBU4RE"
  title="Ceph Tech Talk: Karan Singh - Scale Testing Ceph with 10Billion+ Objects 2020-10-01"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>
```

We can capture this markup in a shortcode so we don't need to repeat it everytime we want to embed a YouTube video. It accepts two values, the `id` and the `title` of the video, and uses the following syntax:

```
{% YouTube 'vQF17UBU4RE', 'Ceph Tech Talk: Karan Singh - Scale Testing Ceph with 10Billion+ Objects 2020-10-01' %}
```

We call shortcodes by name with the Nunjucks block syntax: `{% YouTube %}`. The first argument we pass is the `id` of the video (e.g. `'vQF17UBU4RE'`). The second (optional) argument will set the `title` attribute of the iframe embed (e.g. `'Ceph Tech Talk: Karan Singh - Scale Testing Ceph with 10Billion+ Objects 2020-10-01'`).

_Note:_ Shortcode arguments are type-/space-sensitive, so should should include surrounding `'` quote marks.

We now have a single source of truth for the YouTube embed code making it easy to maintain and easy to reuse with a simple, clean interface.

## :warning: Something wrong with ceph.io website?

Report any website issues you experience by email to **Mike Perez** <miperez@redhat.com>, *Ceph Community Manager*. Please include a brief description of the problem and a link that led to it. 