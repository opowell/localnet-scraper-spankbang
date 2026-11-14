import { afterEach, describe, expect, it } from 'vitest'
import { parserLoader, resetPage, setSiteRules, useSourceRules, videoEmbed, visit } from '#scraper-test'

// The parser, evaluated with the helpers it is injected with, as a scrape runs it.
const load = parserLoader(__dirname)

afterEach(resetPage)

describe('spankBang', () => {
  it('reads https://spankbang.party/s/red/ as a listing of what it links to', async () => {
    const { parseSpankBang } = load('spankbang.js', ['parseSpankBang'])
    visit('https://spankbang.party/s/red/', '<a href="/a5gu2/video/a+video">A</a><a href="/51y/channel/bluebird/">B</a>')
    expect(await parseSpankBang()).toEqual({ listing: true, links: [{ url: 'https://spankbang.party/a5gu2/video/a+video', score: 1 }] })
  })

  it('plays its videos in the site\'s own player, as its source says', () => {
    useSourceRules(__dirname)
    expect(videoEmbed('https://spankbang.party/a5gu2/embed/')).toBe('https://spankbang.party/a5gu2/embed/')
    setSiteRules([])
  })
})
