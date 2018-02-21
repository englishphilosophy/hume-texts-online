/* formatting functions (for displaying paragraphs) */
((regex) => {

  /* get url from a paragraph */
  const url = (section, paragraph) =>
    `texts/${section.id.toLowerCase().replace(' ', '/')}#${paragraph.id}`;

  /* get (full) reference for a paragraph (including page numbers) */
  const ref = (section, paragraph) =>
    paragraph.page ?
      `${section.id}.${paragraph.id}, ${section.pages} ${paragraph.page}`
      : `${section.id}.${paragraph.id}`;

  /* convert text into HTML formatted text (for display) */
  const formatText = (text) =>
    text.replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/~(.*?)~/g, '<span class="wide">$1</span>')
      .replace(/\*(.*?)\*/g, '<span class="sc">$1</span>')
      .replace(/\^(.*?)\^/g, '<span class="dc">$1</span>')
      .replace(/\$(.*?)\$/g, '<span class="greek">$1</span>')
      .replace(/`(.*?)`/g, '<blockquote>$1</blockquote>')
      .replace(/\/\//g, '<br>')
      .replace(/¬/g, '<span class="tab"></span>')
      .replace(/\[(\d+?)\]/g, '<sup>[$1]</sup>')
      .replace(/\|/g, '<span class="page-break">|</span>')
      .replace(/\[#\d+?\]/g, '')
      .replace(/\[\-(.*?) \+(.*?) @(.*?)\]/g, '<del>$1</del> <ins title="$3">$2</ins>')
      .replace(/\[\-(.*?) @(.*?)\]/g, '<del title="$2">$1</del>')
      .replace(/\[\+(.*?) @(.*?)\]/g, '<ins title="$2">$1</ins>');

  /* convert text to HTML with matching terms highlighted */
  const formatTextWithQuery = (text, query) =>
    formatText(text).replace(regex(query), '<mark>$1</mark>');

  /* create full HTML display of a paragraph */
  const formatForPage = (section, paragraph) =>
    paragraph.title
      ? `<div class="paragraph">${formatText(paragraph.title)}</div><div class="paragraph"><div class="ref">${ref(section, paragraph)}</div><p class="${paragraph.type}">${formatText(paragraph.text)}</p></div>`
      : `<div class="paragraph"><div class="ref">${ref(section, paragraph)}</div><p class="${paragraph.type}">${formatText(paragraph.text)}</p></div>`;

  /* create full HTML display of a paragraph with query highlighted (for showing search results) */
  const formatForSearch = (section, query, paragraph) =>
    `<div class="paragraph"><div class="ref"><a href="${url(section, paragraph)}">${ref(section, paragraph)}</a></div><p class="${paragraph.type}">${formatTextWithQuery(paragraph.text, query)}</p></div>`;

  /* expose the two format functions */
  return { title: formatText, page: formatForPage, search: formatForSearch };

})(regex);
