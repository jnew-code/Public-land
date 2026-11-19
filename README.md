# Texas Public Land Guide (private prototype)

A free, offline-capable guide to Texas public hunting land near Clifton and College Station. Plain HTML/CSS/JS, no build step. Installable as a phone app (PWA).

## Publish on GitHub Pages
1. Create a repo and put the contents of this folder at the repo root (or in `/docs`), including the hidden `.nojekyll` file.
2. Repo Settings > Pages > deploy from the branch and folder you used.
3. Open `https://<user>.github.io/<repo>/`. All paths are relative, so the project path works.

## Install on a phone
- iPhone: open the link in Safari > Share > Add to Home Screen.
- Android: open in Chrome > menu > Install app / Add to Home screen.
Open the app once while online so it caches everything; after that it works offline. (GitHub Pages serves https, which the service worker needs.)

## Updating
Edit files, then change `VERSION` in `sw.js` (for example `tx-land-guide-v2`) so installed copies refresh. Add any new files to the `PRECACHE` list in `sw.js`. Installed apps pick up the update the second time they are opened.

## Data
`data/areas.js` holds the areas and TPWD source links. `data/hunting-bot.js` is an empty drop-in for more hunting data. The site is not indexed by search engines (`noindex`). Rules change every season. Verify with TPWD. Not legal advice.
