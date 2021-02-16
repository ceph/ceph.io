<p align="center"><img src="https://i2.wp.com/ceph.io/wp-content/uploads/2016/07/Ceph_Logo_Standard_RGB_120411_fa.png?resize=322%2C148&ssl=1" alt="Ceph" /></p>

# Events

## Frontmatter

```yaml
---
title: Event title
date: yyyy-mm-dd
end: yyyy-mm-dd
location: Event location
venue: Event venue
map: "https://www.google.com/maps"
register: "https://www.eventbrite.com/"
image: "/assets/image.jpg"
links:
  videos: "https://www.youtube.com/"
  slides: "https://ceph.io/event.pdf"
sponsors:
  - label: Platinum sponsors
    list:
      - name: SoftIron
        logo: "/assets/image.png"
        website: "https://softiron.com"
      - name: RedHat
        logo: "/assets/image.png"
        website: "https://redhat.com"
  - label: Gold sponsors
    list:
      - name: SUSE
        logo: "/assets/image.png"
        website: "https://suse.com"
tags:
  - taxonomy
  - taxonomy
---

```

- `title` (String) — Determines the link text as it appears in the event navigation card. Also used as the `<title>` for the page.\*
- `date` (Date) — Determines the start date of the event.
- `end` (Date) — Determines the end date of the event.
- `location` (String) — Determines the location of the event, city and country.
- `venue` (String) — Determines the venue of the event, building name and street.
- `map` (String) — Determines the map of the event with a google maps link.\*
- `register` (String) — Determines the website to register for the event. This is hidden once the end date of the event has pasted.
- `image` (String) — Determines the asset path for the image shown in the event navigation card and the hero image beneath the title on the event page.
- `links` (List) - These only appear when the end date of the event has pasted.
  - `videos` (String) — Determines the website showing videos of the event with a youtube/vimeo link.
  - `slides` (String) — Determines the website or PDF showing slides of the event.
- `sponsors` (Array)
  - `label` (String) — Determines the type of sponsors for the event.
    `list`
    - `name` (String) — Determines the name of the sponsor.
      `logo` (String) — Determines the asset path for the sponsor logo.
      `website` (String) — Determines the URL of the sponsor website which is applied to the sponsor logo.
- `tags` (Array) - This is an array of values that determine the taxonomy of the event.
  - (String) - Choose from a pre-defined selection of values that apply only to events. You can apply as many values as required.

\* Careful with any strings that include a colon `:`, as YAML uses this as the key-value pair delimiter. A `URL` will always include a colon and possibly the other values will include them too. For example let's say the `title` needs to include colons, wrap the `title` string in double-quote marks `"` to ensure it renders as intended or if a URL contains.

```yaml
title: "Storage or: How I Learned to Stop Worrying and Love Ceph"
map: "https://www.google.com/maps"
```

## Events structure

The content of the events can be found in the `src/{locale}/community/events/yyyy/event` directories. Any folder/page created within these directories will generate a web page in the site.

### Folders and file naming

| Input File                                         | Output URL                            |
| -------------------------------------------------- | ------------------------------------- |
| /src/{locale}/community/events/yyyy/event/index.md | /{locale}/community/events/yyyy/event |
