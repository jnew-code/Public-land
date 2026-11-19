# Texas Public Land Guide

Free guide to Texas public hunting land in Central Texas. Plain HTML/CSS/vanilla JS, no build step, installable PWA with offline support.

- `data/areas.js`, `data/areas-central.js`: areas, TPWD source links, dates. `data/photos.js`: Wikimedia credits.
- `data/hunting-bot.js`: optional drop-in overrides for hunting data by area id.
- Update flow: edit data, bump `VERSION` in `sw.js`, add new files to its `PRECACHE` list.
- Theme: Night Hunt (single theme) with fixed photo backgrounds in `img/bg-*.webp` ("Photos by Judd New").
