<p align="center"><img src="https://i2.wp.com/ceph.io/wp-content/uploads/2016/07/Ceph_Logo_Standard_RGB_120411_fa.png?resize=322%2C148&ssl=1" alt="Ceph" /></p>

# Case studies

## Frontmatter

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
- `image` (String) — Determines the asset path for the image shown in the case study navigation card and the hero image beneath the title on the case study page.\*
- `sponsor` (Array) - This is an array of values that all contribute to the sponsor information on the case study page.
  - `name` (String) - Determines the name of the sponsor.
  - `logo` (String) - Determines the asset path for the sponsor logo.
  - `website` (String) - Determines the URL of the sponsor website which is applied to the sponsor logo and button shown on the case study page.
- `tags` (Array) - This is an array of values that determine the taxonomy of the case study page.
  - (String) - Choose from a pre-defined selection of values that apply only to case studies. You can apply as many values as required.

\* Careful with any strings that include a colon `:`, as YAML uses this as the key-value pair delimiter. A `URL` will always include a colon and possibly the other values will include them too. For example let's say the `title` needs to include colons, wrap the `title` string in double-quote marks `"` to ensure it renders as intended or if a URL contains.

```yaml
title: "Storage or: How I Learned to Stop Worrying and Love Ceph"
image: "https://via.placeholder.com/50"
```

## Case study structure

The content of the case studies can be found in the `src/{locale}/solutions/case-studies/case-study` directories. Any folder/page created within these directories will generate a web page in the site.

### Folders and file naming

| Input File                                               | Output URL                                  |
| -------------------------------------------------------- | ------------------------------------------- |
| /src/{locale}/solutions/case-studies/case-study/index.md | /{locale}/solutions/case-studies/case-study |
