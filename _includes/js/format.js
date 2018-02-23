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

  /* create HTML display of a paragraph title */
  const formatTitle = title =>
    `<div class="block">
      <div class="meta"></div>
      <div class="content">${formatText(title)}</div>
    </div>`;

  /* create HTML display of paragraph content */
  const formatContent = (section, paragraph) =>
    `<div class="block" id="${paragraph.id}">
      <div class="meta">${ref(section, paragraph)}</div>
      <div class="content"><p class="${paragraph.type}">${formatText(paragraph.text)}</p></div>
    </div>`

  /* create full HTML display of a paragraph */
  const formatForPage = (section, paragraph) =>
    paragraph.title
      ? `${formatTitle(paragraph.title)}${formatContent(section, paragraph)}`
      : `${formatContent(section, paragraph)}`;

  /* create full HTML display of a paragraph with query highlighted (for showing search results) */
  const formatForSearch = (section, query, paragraph) =>
    `<div class="block">
      <div class="meta"><a href="${url(section, paragraph)}">${ref(section, paragraph)}</a></div>
      <div class="content"><p class="${paragraph.type}">${formatTextWithQuery(paragraph.text, query)}</p></div>
    </div>`;

  /* expose the two format functions */
  return { title: formatTitle, page: formatForPage, search: formatForSearch };

})(regex);
