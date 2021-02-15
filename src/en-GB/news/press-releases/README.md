<p align="center"><img src="https://i2.wp.com/ceph.io/wp-content/uploads/2016/07/Ceph_Logo_Standard_RGB_120411_fa.png?resize=322%2C148&ssl=1" alt="Ceph" /></p>

# Press releases

## Page data

At the beginning of all press releases, there's a block of data wrapped with ---. This is called frontmatter, and defines data specific to that page in the site.

The frontmatter data is written in [YAML format](https://yaml.org/) using `key: value` pairs. Frontmatter for the press release pages follows a specific schema:

```yaml
---
title: Press release title
date: yyyy-mm-dd
author: Press release author name
image: "/assets/image.jpg"
tags:
  - taxonomy
  - taxonomy
---

```

- `title` (String) — Determines the link text as it appears in the press release navigation card. Also used as the `<title>` for the page.\*
- `date` (Date) — Determines the published date of the press release.
- `author` (String) — Determines the name of the press release author.
- `image` (String) — Determines the image shown in the press release navigation card and the hero image beneath the title on the press release page.
- `tags` (Array) - This is an array of values that determine the taxonomy of the press release page.
  - (String) - Choose from a pre-defined selection of values that apply only to press releases. You can apply as many values as required.\*

\* Careful with any strings that include a colon `:`, as YAML uses this as the key-value pair delimiter. If the title needs to include colons, wrap the `title` string in double-quote marks `"` to ensure it renders as intended. E.g.

```yaml
title: "Storage or: How I Learned to Stop Worrying and Love Ceph"
```

## Authoring pages

While the press release pages are all composed in Markdown `.md` files, there are a few bonus features.

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

If we were on a _press-releases_ page (`/press-releases/yyyy/press-release`), we could link to another press release page in two ways:

```md
[Relative link to press release](../press-release/)

[Root relative link to press release](/press-releases/yyyy/press-release/)
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

## Dynamic values

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

## Press release structure

The contents of the press releases can all be found in the `src/locale/news/press-releases/yyyy/` directories. Any folder/page created within these directories will generate a web page in the site.

### Folders and file naming

| Input File                                    | Output URL                                     |
| --------------------------------------------- | ---------------------------------------------- |
| /src/locale/news/press-releases/yyyy/index.md | /locale/news/press-releases/yyyy/press-release |
