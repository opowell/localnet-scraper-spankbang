// A video's page on SpankBang (spankbang.com, spankbang.party), /<id>/video/<slug>, its id (a5gu2), else null.
function spankbangId(url) {
  const page = new URL(url, location.href)
  return /(?:^|\.)spankbang\.[a-z]+$/.test(page.hostname) ? /^\/(\w+)\/video\/[^/]+\/?$/.exec(page.pathname)?.[1] ?? null : null
}

// A video page (/a5gu2/video/krystal+jordan+milks+nathan+threat) is one video (see videoPage), played in SpankBang's
// player: its title the page's heading, its length the og:video:duration tag's, and, of the links under it before the
// first of the videos the page offers beside it, its channel's or uploader's as its uploader, its pornstars' as its
// performers and its searches' (/s/bbc/) as its tags; the videos related to it are the others in its section. Its
// description is the site's blurb, so is left out. Any other page (the home page, a channel, a search) is a listing
// of the videos it shows.
function parseSpankBang(_profileId) {
  if (!/(?:^|\.)spankbang\.[a-z]+$/.test(location.hostname)) {
    return null
  }
  const id = spankbangId(location.href)
  if (!id) {
    return videoListing(url => (spankbangId(url) ? url.split(/[?#]/)[0] : null))
  }
  const section = document.querySelector('#video') || document.body
  const firstVideo = section.querySelector('[data-testid="video-item"], .js-video-item')
  const before = a => !firstVideo || Boolean(a.compareDocumentPosition(firstVideo) & Node.DOCUMENT_POSITION_FOLLOWING)
  const info = Array.from(section.querySelectorAll('a[href]')).filter(a => before(a) && !a.closest('[data-testid="video-item"], .js-video-item'))
  const named = path => namedLinks(info.filter(a => path.test(new URL(a.href).pathname)))
  const uploader = named(/^\/\w+\/(?:channel|profile)\//)[0]
  return videoPage({
    player: `${location.origin}/${id}/embed/`,
    title: document.querySelector('h1[data-testid="video-title"], h1')?.innerText.trim(),
    description: null,
    authors: uploader ? [{ name: uploader.text, url: uploader.url }] : [],
    performers: named(/^\/\w+\/pornstar\//),
    tags: named(/^\/s\/[^/]+\/$/),
    related: Array.from(section.querySelectorAll('a[href*="/video/"]'), a => a.href).filter(spankbangId).map(url => url.split(/[?#]/)[0]),
    seconds: Number(metaContent('og:video:duration')) || null,
  })
}

// The parser a scrape calls.
registerParser(parseSpankBang)
