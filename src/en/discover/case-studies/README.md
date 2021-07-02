<p align="center"><img src="https://i2.wp.com/ceph.io/wp-content/uploads/2016/07/Ceph_Logo_Standard_RGB_120411_fa.png?resize=322%2C148&ssl=1" alt="Ceph" /></p>

# Case studies

## Frontmatter

```yaml
---
title: Case study title
image: "images/image.jpg"
sponsor:
  name: name
  logo: "/assets/bitmaps/logo.png"
  website: "https://www.website.com"
tags:
  - taxonomy
  - taxonomy
---
```

- `title` (String) — Title text for the case study and used as the `<title>` for the page. Also appears in the case study card found on listing pages.\*
- `image` (String) — Asset path for the hero image on the case study page. Also appears in the case study card found on listing pages\*
- `sponsor` (Array)
  - `name` (String) - Name of the sponsor.
  - `logo` (String) - Asset path for the sponsor logo.
  - `website` (String) - Website URL for the sponsor.
- `tags` (Array) - Array of values that determine the taxonomy of the case study.
  - (String) - Choose from a pre-defined selection of values that apply only to case studies. You can apply as many values as required.

\* Careful with any strings that include a colon `:`, as YAML uses this as the key-value pair delimiter. A `URL` will always include a colon and possibly the other values will include them too. For example let's say the `title` needs to include colons, wrap the `title` string in double-quote marks `"` to ensure it renders as intended or if a URL contains.

```yaml
title: "Storage or: How I Learned to Stop Worrying and Love Ceph"
image: "https://via.placeholder.com/50"
```

## Case study structure

The content of the case studies can be found in the `src/{locale}/discover/case-studies/case-study` directories. Any folder/page created within these directories will generate a web page in the site.

## Case study images

All image assets related a case study need to be co-located with that case study. First you will need to create an `images` folder within the specific case study folder `src/{locale}/discover/case-studies/case-study/images`, you can then place all image assets within this folder.

## Case study logos

Logo assets are stored in a centralized location `src/assets/bitmaps` which helps us maintain a single source of truth for them. They maybe used on multiple pages and it prevents the need to duplicate them for each page. Notice when adding logos to the frontmatter they are root relative `/assets/bitmaps/logo.png`.

### Folders and file naming

| Input File                                                      | Output URL                                                  |
| --------------------------------------------------------------- | ----------------------------------------------------------- |
| /src/{locale}/discover/case-studies/case-study/index.md         | /{locale}/discover/case-studies/case-study                  |
| --------------------------------------------------------------- | ----------------------------------------------------------- |
| /src/{locale}/discover/case-studies/case-study/images/image.jpg | /{locale}/discover/case-studies/case-study/images/image.jpg |
