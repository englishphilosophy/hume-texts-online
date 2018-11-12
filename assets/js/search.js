// get an array of all the searchable blocks from the texts
export const prepare = (texts) =>
  blocks(texts, 'all')

// get blocks (recursively) for a text with the given id
const blocks = (texts, id) => {
  const text = texts[id]
  let result
  if (text.texts) {
    return text.texts.map(blocks.bind(null, texts)).reduce((y, z) => y.concat(z), [])
  }
  if (text.paragraphs) {
    result = text.paragraphs.map(block.bind(null, text, false, false))
  }
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
    text: text.label,
    id: note ? `n${block.id}` : block.id,
    url: textUrl(text),
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
    ? `/texts/${labelUrl(text.parent)}/${labelUrl(text.label)}`
    : `/texts/${labelUrl(text.label)}`

const labelUrl = label =>
  label.toLowerCase().replace(/(\.|-)/g, '/')

const fullContent = (content, edited) =>
  ({
    plain: plainContent(content, edited),
    rich: richContent(content, edited)
  })

const plainContent = (content, edited) =>
  richContent(content, edited)
    .replace(/(<(.*?)>)/g, '')
    .replace(/\s\s/g, ' ')
    .trim()

const richContent = (content, edited) =>
  baseContent(content, edited)
    .replace(/<sup>(.*?)<\/sup>/g, '')
    .replace(/<span class=['"]margin-comment['"]>(.*?)<\/span>/g, '')
    .replace(/<span class=['"]page-break['"]>\|<\/span>/g, '')
    .replace(/\s\s/g, ' ')
    .trim()

const baseContent = (content, edited) =>
  edited
    ? content.replace(/<del( title=['"](.*?)['"])?>(.*?)<\/del>/g, '')
    : content.replace(/<ins( title=['"](.*?)['"])?>(.*?)<\/ins>/g, '')

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
  const arr = labels(texts, id)
  return blocks.filter(x => arr.indexOf(x.text) > -1)
}

const labels = (texts, id) => {
  const text = texts[id]
  return text.texts
    ? text.texts.map(id => labels(texts, id)).reduce((x, y) => x.concat(y), [])
    : [text.label]
}

// filter search range to get results
export const results = (blocks, regex, edited) =>
  edited
    ? blocks.filter(x => x.edited.plain.match(regex))
    : blocks.filter(x => x.original.plain.match(regex))
