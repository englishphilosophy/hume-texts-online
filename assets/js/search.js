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
    id: note ? `n${block.id}` : block.id,
    url: variant ? `${textUrl(text)}v` : textUrl(text),
    pages: block.pages ? `${text.pages} ${block.pages}` : '',
    type: block.type,
    note,
    variant,
    original: fullContent(block.content, false),
    edited: fullContent(block.content, true)
  })

// functions needed to augment a block
export const textUrl = text =>
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
export const regex = (query, advanced) =>
  advanced ? new RegExp(`(${query})`, 'gi') : new RegExp(`\\b(${simplify(query)})\\b`, 'gi')

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

// filter blocks to get search range
export const range = (texts, blocks, ids, variants) =>
  variants ? some(texts, blocks, ids) : some(texts, blocks, ids).filter(x => !x.variant)

const some = (texts, blocks, ids) =>
  ids.map(id => one(texts, blocks, id)).reduce((x, y) => x.concat(y), [])

const one = (texts, blocks, id) => {
  const arr = ids(texts, id)
  return blocks.filter(x => arr.indexOf(x.text) > -1)
}

const ids = (texts, id) => {
  const text = texts[id]
  return text.texts
    ? text.texts.map(id => ids(texts, id)).reduce((x, y) => x.concat(y), [])
    : [text.id]
}

// filter search range to get results
export const results = (blocks, regex, edited) =>
  edited
    ? blocks.filter(x => x.edited.plain.match(regex))
    : blocks.filter(x => x.original.plain.match(regex))
