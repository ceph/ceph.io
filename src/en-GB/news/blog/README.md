<p align="center"><img src="https://i2.wp.com/ceph.io/wp-content/uploads/2016/07/Ceph_Logo_Standard_RGB_120411_fa.png?resize=322%2C148&ssl=1" alt="Ceph" /></p>

# Blog posts

## Frontmatter

```yaml
---
title: Blog post title
date: yyyy-mm-dd
author: Blog post author name
image: "/assets/image.jpg"
tags:
  - taxonomy
  - taxonomy
---

```

- `title` (String) — Determines the link text as it appears in the blog post navigation card. Also used as the `<title>` for the page.\*
- `date` (Date) — Determines the published date of the blog post.
- `author` (String) — Determines the name of the blog post author.
- `image` (String) — Determines the asset path for the image shown in the blog post navigation card and the hero image beneath the title on the blog post page.\*
- `tags` (Array) - This is an array of values that determine the taxonomy of the blog post.
  - (String) - Choose from a pre-defined selection of values that apply only to blog posts. You can apply as many values as required.

\* Careful with any strings that include a colon `:`, as YAML uses this as the key-value pair delimiter. A `URL` will always include a colon and possibly the other values will include them too. For example let's say the `title` needs to include colons, wrap the `title` string in double-quote marks `"` to ensure it renders as intended or if a URL contains.

```yaml
title: "Storage or: How I Learned to Stop Worrying and Love Ceph"
image: "https://via.placeholder.com/50"
```

## Blog post structure

The content of the blog posts can be found in the `src/{locale}/news/blog/yyyy/blog-post` directories. Any folder/page created within these directories will generate a web page in the site.

### Folders and file naming

| Input File                                      | Output URL                         |
| ----------------------------------------------- | ---------------------------------- |
| /src/{locale}/news/blog/yyyy/blog-post/index.md | /{locale}/news/blog/yyyy/blog-post |
