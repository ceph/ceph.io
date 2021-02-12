<p align="center"><img src="https://i2.wp.com/ceph.io/wp-content/uploads/2016/07/Ceph_Logo_Standard_RGB_120411_fa.png?resize=322%2C148&ssl=1" alt="Ceph" /></p>

# Case studies

## Page data

At the beginning of all case studies, there's a block of data wrapped with ---. This is called frontmatter, and defines data specific to that page in the site.

The frontmatter data is written in [YAML format](https://yaml.org/) using `key: value` pairs. Frontmatter for the case study pages follows a specific schema:

```yaml
---
title: Case study title
image: "/assets/image.jpg"
sponsor:
  name: name
  logo: "/assets/logo.png"
  website: "https://www.website.com"
tags:
  - taxonomy
  - taxonomy
---

```

- `title` (String) — Determines the link text as it appears in the case study navigation card. Also used as the `<title>` for the page.\*
- `image` (String) — Determines the image shown in the case study navigation card and the hero image beneath the title on the case study page.
- `sponsor` (Array) - This is an array of values that all contribute to the sponsor information on the case study page.
  - `name` (String) - Determines the sponsor name as it appears in the case study page.\*
  - `logo` (String) - Determines the sponsor logo shown in the case study page.
  - `website` (String) - Determines the URL for the sponsor’s website. This is applied to the sponsor logo and button shown in the case study page.
- `tags` (Array) - This is an array of values that determine the taxonomy of the case study page.
  - (String) - Choose from a pre-defined selection of values that apply only to case studies. You can apply as many values as required.\*

\* Careful with any strings that include a colon `:`, as YAML uses this as the key-value pair delimiter. If the title needs to include colons, wrap the `title` string in double-quote marks `"` to ensure it renders as intended. E.g.

```yaml
title: "Storage or: How I Learned to Stop Worrying and Love Ceph"
```

## Authoring pages

While the case study pages are all composed in Markdown `.md` files, there are a few bonus features.

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

If we were on a _case-studies_ page (`/case-studies/case-study`), we could link to another case study page in two ways:

```md
[Relative link to case study](../case-study/)

[Root relative link to case study](/case-studies/case-study/)
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

## Case study structure

The contents of the case studies can all be found in the `src/locale/solutions/case-studies/` directory. Any folder/page created within this directory will generate a web page in the site.

### Folders and file naming

| Input File                                             | Output URL                                 |
| ------------------------------------------------------ | ------------------------------------------ |
| /src/locale/solutions/case-studies/case-study/index.md | /locale/solutions/case-studies/case-study/ |
