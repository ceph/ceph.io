<p align="center"><img src="https://i2.wp.com/ceph.io/wp-content/uploads/2016/07/Ceph_Logo_Standard_RGB_120411_fa.png?resize=322%2C148&ssl=1" alt="Ceph" /></p>

# Press releases

## Frontmatter

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
- `image` (String) — Determines the asset path for the image shown in the press release navigation card and the hero image beneath the title on the press release page.\*
- `tags` (Array) - This is an array of values that determine the taxonomy of the press release.
  - (String) - Choose from a pre-defined selection of values that apply only to press releases. You can apply as many values as required.

\* Careful with any strings that include a colon `:`, as YAML uses this as the key-value pair delimiter. A `URL` will always include a colon and possibly the other values will include them too. For example let's say the `title` needs to include colons, wrap the `title` string in double-quote marks `"` to ensure it renders as intended or if a URL contains.

```yaml
title: "Storage or: How I Learned to Stop Worrying and Love Ceph"
image: "https://via.placeholder.com/50"
```

## Press release structure

The content of the press releases can be found in the `src/{locale}/news/press-releases/yyyy/press-release` directories. Any folder/page created within these directories will generate a web page in the site.

### Folders and file naming

| Input File                                                    | Output URL                                       |
| ------------------------------------------------------------- | ------------------------------------------------ |
| /src/{locale}/news/press-releases/yyyy/press-release/index.md | /{locale}/news/press-releases/yyyy/press-release |
