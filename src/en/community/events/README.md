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

- `title` (String) — Title text for the event and used as the `<title>` for the page. Also appears in the event card found on listing pages.\*
- `date` (Date) — Start date of the event.
- `end` (Date) — End date of the event.
- `location` (String) — Location of the event, city and country. If set to virtual, set the value to virtual.
- `venue` (String) — Venue of the event, building name and street.
- `register` (String) — Website URL to register for the event. This is hidden once the end date of the event has passed.\*
- `image` (String) — Asset path for the hero image on the event page. Also appears in the event card found on listing pages.
- `links` (List) - These only appear when the end date of the event has pasted.
  - `videos` (String) — Website URL with videos of the event.
  - `slides` (String) — Website URL or PDF showing slides of the event.
- `sponsors` (Array)
  - `label` (String) — Type of event sponsors.
    `list`
    - `name` (String) — Name of the sponsor.
      `logo` (String) — Asset path for the sponsor logo.
      `website` (String) — Website URL for the sponsor.
- `tags` (Array) - Array of values that determine the taxonomy of the event.
  - (String) - Choose from a pre-defined selection of values that apply only to events. You can apply as many values as required.

\* Careful with any strings that include a colon `:`, as YAML uses this as the key-value pair delimiter. A `URL` will always include a colon and possibly the other values will include them too. For example let's say the `title` needs to include colons, wrap the `title` string in double-quote marks `"` to ensure it renders as intended or if a URL contains.

```yaml
title: "Storage or: How I Learned to Stop Worrying and Love Ceph"
register: "https://www.eventbrite.com/"
```

## Events structure

The content of the events can be found in the `src/{locale}/community/events/yyyy/event` directories. Any folder/page created within these directories will generate a web page in the site.

### Folders and file naming

| Input File                                         | Output URL                            |
| -------------------------------------------------- | ------------------------------------- |
| /src/{locale}/community/events/yyyy/event/index.md | /{locale}/community/events/yyyy/event |
