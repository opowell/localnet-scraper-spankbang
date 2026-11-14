# SpankBang scraper for Localnet

Reads `spankbang` pages for Localnet, a browser extension that is a personal search engine.
Localnet pulls it from here the first time it scrapes such a page, through the
[localnet-scrapers](https://github.com/opowell/localnet-scrapers) scraper source.

A video page (/a5gu2/video/krystal+jordan+milks+nathan+threat) is one video (see videoPage in Localnet's DOM helpers), played in SpankBang's player: its title the page's heading, its length the og:video:duration tag's, and, of the links under it before the first of the videos the page offers beside it, its channel's or uploader's as its uploader, its pornstars' as its performers and its searches' (/s/bbc/) as its tags; the videos related to it are the others in its section. Its description is the site's blurb, so is left out. Any other page (the home page, a channel, a search) is a listing of the videos it shows.

- `source.json`: what Localnet reads to know the scraper: its name, the URLs it reads, how the site is searched, and the file to run.
- `spankbang.js`: the parser. It is injected into the scraped page after Localnet's DOM helpers (content-scripts/utils/dom.js) and defines `window.__dynamicParser`.
- `spankbang.test.ts`: its unit tests, run from a Localnet checkout (`pnpm parsers pull`, then `pnpm test parsers/localnet-scraper-spankbang`).
- `saved-pages/` (not in git): real pages saved from the site, which Localnet's `e2e/saved-pages.test.ts` scrapes. See Localnet's README.
- Its videos are played in Read in the site's own player (its embed page), as `source.json`'s `videos` says: the site's own files are signed for the viewer's address or for a few hours.
