import * as session from './session.js'

// text data object
const blocks = {}

// load the text data for searching and paragraph lookup
const init = async () => {
  const get = async (id) => {
    const text = await window.fetch(`/assets/js/data/${id}.json`)
    const data = await text.json()
    return data.map(prepare).reduce((x, y) => x.concat(y), [])
  }
  blocks['t0'] = await get('t0')
  blocks['t1'] = await get('t1')
  blocks['t2'] = await get('t2')
  blocks['t3'] = await get('t3')
  blocks['tapp'] = await get('tapp')
  blocks['a'] = await get('a')
  blocks['l'] = await get('l')
  blocks['e'] = await get('e')
  blocks['p'] = await get('p')
  blocks['m'] = await get('m')
  blocks['n'] = await get('n')
  blocks['h'] = await get('h')
  blocks['d'] = await get('d')
  blocks['essays'] = await get('essays')
  blocks['ads'] = await get('ads')
}

// new search query
export const newSearch = async (query) => {
  if (Object.keys(blocks).length !== 15) await init()
  const outer = session.getRange().map(id => blocks[id]).reduce((x, y) => x.concat(y), [])
  const inner = session.get('search-variants') ? outer : outer.filter(x => !x.variant)
  return subSearch(query, inner)
}

// search within given results
export const subSearch = (query, range) =>
  session.get('show-edited')
    ? range.filter(x => x.edited.plain.match(regex(query)))
    : range.filter(x => x.original.plain.match(regex(query)))

// display search result
export const display = (query, block) =>
  `<div class="${classes(block)}">
    <div class="meta">${ref(block)}</div>
    <div class="content">
      ${content(block).replace(regex(query), '<mark>$&</mark>')}
    </div>
  </div>`

// get an array of all the searchable blocks from a text
export const prepare = (text) => {
  let result = text.paragraphs.map(block.bind(null, text, false, false))
  if (text.notes) {
    result = result.concat(text.notes.map(block.bind(null, text, true, false)))
  }
  if (text.variants) {
    text.variants.forEach((variant) => {
      if (variant.paragraphs) {
        result = result.concat(variant.paragraphs.map(block.bind(null, text, false, true)))
      }
      if (variant.notes) {
        result = result.concat(variant.notes.map(block.bind(null, text, true, true)))
      }
    })
  }
  return result
}

// augment a block (i.e. paragraph or note) so it's ready for searching
const block = (text, note, variant, block) =>
  ({
    text: text.id,
    id: note ? `${block.paragraph}n${block.id}` : block.id,
    url: variant ? `${textUrl(text)}v` : textUrl(text),
    pages: block.pages ? `${text.pages} ${block.pages}` : '',
    type: block.type,
    note,
    variant,
    original: fullContent(block.content, false),
    edited: fullContent(block.content, true)
  })

// functions needed to augment a block
const textUrl = text =>
  text.parent
    ? `/texts/${idlUrl(text.parent)}/${idlUrl(text.id)}`
    : `/texts/${idlUrl(text.id)}`

const idlUrl = id =>
  id.toLowerCase().replace(/(\.|-)/g, '/')

const fullContent = (content, edited) =>
  ({
    plain: plainContent(content, edited),
    rich: richContent(content, edited)
  })

const plainContent = (content, edited) =>
  richContent(content, edited)
    .replace(/<i>(.*?)<\/i>/g, '') // remove greek text
    .replace(/(<(.*?)>)/g, '') // remove all HTML markup
    .replace(/(&emsp;)+/g, ' ') // replace tabs with single spaces
    .replace(/\s\s/g, ' ').trim() // trim whitespace

const richContent = (content, edited) =>
  baseContent(content, edited)
    .replace(/<a href="(.*?)"><sup>(.*?)<\/sup><\/a>/g, '') // remove footnote anchors
    .replace(/<small>(.*?)<\/small>/g, '') // remove small things
    .replace(/\|/g, '') // remove page breaks

const baseContent = (content, edited) =>
  edited
    ? content.replace(/<del( title="(.*?)")?>(.*?)<\/del>/g, '').replace(/<ins( title="(.*?)")?>(.*?)<\/ins>/g, '$3')
    : content.replace(/<ins( title="(.*?)")?>(.*?)<\/ins>/g, '').replace(/<del( title="(.*?)")?>(.*?)<\/del>/g, '$3')

// turn a query string into a regular expression
const regex = (query) =>
  session.get('search-advanced')
    ? new RegExp(`(${query})`, 'gi')
    : new RegExp(`\\b(${simplify(query)})\\b`, 'gi')

const simplify = query =>
  query.replace(/[.,;:?!]/g, '')
    .replace(/(ct|x)ion\b/g, '(ct|x)ion')
    .replace(/ould\b/g, 'ou(l|\')d')
    .replace(/ied\b/g, '(ied|y\'d)')
    .replace(/ed\b/g, '(ed|\'d)')
    .replace(/though\b/g, 'tho(ugh|\')')
    .replace(/\bbetw(ixt|een)\b/g, 'betw(ixt|een)')
    .replace(/\bdispatch(t|ed)\b/g, 'dispatch(t|ed)')
    .replace(/\bstop(t|ed)\b/g, 'stop(t|ed)')
    .replace(/phenomen/g, 'ph(e|ae)nomen')
    .replace(/ae/g, '(ae|æ)')
    .replace(/economy/g, '(e|oe)conomy')
    .replace(/oe/g, '(oe|œ)')
    .replace(/\ba\b/g, '(a|à)')
    .replace(/\bit (is|was|were)\b/g, '(it $1|\'t$1)')
    .replace(/\s/g, '[.,;:?!]? ')

// functions needed to display a block
const classes = block =>
  block.type ? `block ${block.type}` : 'block'

const ref = block =>
  block.pages
    ? `<a href="${block.url}#${block.id}">${label(block)}, ${block.pages}</a>`
    : `<a href="${block.url}#${block.id}">${label(block)}</a>`

const label = block =>
  `${block.text}.${block.id}`.replace('.', ' ')

const content = (block) =>
  session.get('show-edited')
    ? block.edited.rich
    : block.original.rich
