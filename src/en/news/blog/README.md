<p align="center"><img src="https://i2.wp.com/ceph.io/wp-content/uploads/2016/07/Ceph_Logo_Standard_RGB_120411_fa.png?resize=322%2C148&ssl=1" alt="Ceph" /></p>

# Blog posts

## Frontmatter

```yaml
---
title: Blog post title
date: yyyy-mm-dd
author: Blog post author name
image: "image.jpg"
tags:
  - taxonomy
  - taxonomy
---
```

- `title` (String) — Title text for the blog post and used as the `<title>` for the page. Also appears in the blog post card found on listing pages.\*
- `date` (Date) — Published date of the blog post.
- `author` (String) — Name of the blog post author.
- `image` (String) — Asset path for the hero image on the blog post page. Also appears in the blog post card found on listing pages.\*
- `tags` (Array) - Array of values that determine the taxonomy of the blog post.
  - (String) - Choose from a pre-defined selection of values that apply only to blog posts. You can apply as many values as required.

\* Careful with any strings that include a colon `:`, as YAML uses this as the key-value pair delimiter. A `URL` will always include a colon and possibly the other values will include them too. For example let's say the `title` needs to include colons, wrap the `title` string in double-quote marks `"` to ensure it renders as intended or if a URL contains.

```yaml
title: "Storage or: How I Learned to Stop Worrying and Love Ceph"
image: "image.jpg"
```

## Blog post structure

The content of the blog posts can be found in the `src/{locale}/news/blog/yyyy/blog-post` directories. Any folder/page created within these directories will generate a web page in the site.

## Blog post images

All image assets related a blog post need to be co-located with that blog post. First you will need to create an `images` folder within the specific blog post folder `src/{locale}/news/blog/yyyy/blog-post/images`, you can then place all image assets within this folder.

### Folders and file naming

| Input File                                              | Output URL                                          |
| ------------------------------------------------------- | --------------------------------------------------- |
| /src/{locale}/news/blog/yyyy/blog-post/index.md         | /{locale}/news/blog/yyyy/blog-post                  |
| ------------------------------------------------------- | --------------------------------------------------- |
| /src/{locale}/news/blog/yyyy/blog-post/images/image.jpg | /{locale}/news/blog/yyyy/blog-post/images/image.jpg |
