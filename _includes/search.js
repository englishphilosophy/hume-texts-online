/* search function */
((options, texts, sections, regex) => {

  /* augment a paragraph with basic section data */
  const augment = (section, paragraph) =>
    Object.assign({ section: section.id, pages: section.pages }, paragraph);

  /* get augmented paragraphs for searching (depends on options) */
  const paragraphs = () =>
    texts.filter(text => options.get(text.id))
      .map(text => text.sections)
      .reduce((x, y) => x.concat(y), [])
      .map(id => sections[id])
      .map(section => section.paragraphs.map(augment.bind(null, section)))
      .reduce((x, y) => x.concat(y), []);

  /* convert text to plain text (for searching) */
  const plain = text =>
    text.replace(/_/g, '')
      .replace(/~/g, '')
      .replace(/\*/g, '')
      .replace(/\^/g, '')
      .replace(/\$/g, '')
      .replace(/`/g, '')
      .replace(/\/\//g, ' ')
      .replace(/¬/g, '')
      .replace(/\[#\d+?\]/g, '')
      .replace(/\[(\d+?)\]/g, '')
      .replace(/<\/>/g, '')
      .replace(/\|/g, '')
      .replace(/\[-(.*?) @(.*?)\]/g, '$2')
      .replace(/\[+(.*?) @(.*?)\]/g, '$2')
      .replace(/\[-(.*?) +(.*?) @(.*?)\]/g, '$2')
      .replace(/æ/ig, 'ae')
      .replace(/œ/ig, 'oe')
      .replace(/Œ/g, 'OE')
      .replace(/[“|”]/g, '"')
      .replace(/’/g, '\'');

  /* search paragraphs for matching query */
  const search = query =>
    paragraphs().filter(p => plain(p.text).match(regex(query)));

  /* expose the search function */
  return search;

})(options, texts, sections, regex);
