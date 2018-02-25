---
layout: null
---
/* basics */
const texts = {{ site.data | jsonify }};
const $ = id => document.getElementById(id);
const path = window.location.pathname.replace(/(^\/|\/$)/g, '').split('/');
const text = $('text') ? texts[$('text').getAttribute('data-text')] : texts[path.slice(1).join('-')];

/* augment a paragraph with basic text data */
const augment = (text, paragraph) =>
  Object.assign({ section: text.label, reference: text.pages }, paragraph);

/* the basic unit of display */
const block = (content, meta, id) =>
  `<div class="block" id="${id || ''}">
    <div class="meta">${meta || ''}</div>
    <div class="content">${content}</div>
  </div>`;

/* turn markdown-style text into pretty HTML */
const pretty = text =>
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

/* title block */
const titleBlock = title => title ? block(pretty(title)) : '';

/* absolute path to a section (based on its id or label) */
const url = id => `/texts/${id.toLowerCase().replace(/(\.|-)/g, '/')}`;

/* paragraph label */
const label = paragraph => `${paragraph.section}.${paragraph.id}`.replace('.', ' ');

/* paragraph pages */
const pages = paragraph => paragraph.pages ? `, ${paragraph.reference} ${paragraph.pages}` : '';

/* paragraph reference (label plus pages, with a hyperlink) */
const ref = paragraph =>
  `<a href="${url(paragraph.section)}/#${paragraph.id}">${label(paragraph)}${pages(paragraph)}</a>`;

/* paragraph block */
const paraBlock = paragraph =>
  block(`<p class="${paragraph.type}">${pretty(paragraph.text)}</p>`, ref(paragraph), paragraph.id);

/* paragraph blocks (from array of paragraphs, plus titles) */
const paraBlocks = paragraphs =>
  paragraphs.map(paragraph => titleBlock(paragraph.title) + paraBlock(paragraph)).join('');

/* table of contents block */
const tocBlock = ids => block(`<ul>${ids.map(id => `<li><a href="${url(id)}">${texts[id].title[1]}</a></li>`).join('')}</ul>`);

/* text display */
const display = (text) => text.paragraphs
  ? (titleBlock(text.title[2]) + paraBlocks(text.paragraphs.map(augment.bind(null, text))))
  : (titleBlock(text.title[2]) + tocBlock(text.texts));

/* text paragraphs (for searching) */
const paragraphs = text =>
  text.paragraphs
    ? text.paragraphs.map(augment.bind(null, text))
    : text.texts.map(x => paragraphs(texts[x])).reduce((y, z) => y.concat(z), []);

/* turn markdown-style text into plain text (for searching) */
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
    .replace(/\[\-(.*?) \+(.*?) @(.*?)\]/g, '$2')
    .replace(/\[\-(.*?) @(.*?)\]/g, '')
    .replace(/\[\+(.*?) @(.*?)\]/g, '$1')
    .replace(/æ/ig, 'ae')
    .replace(/œ/ig, 'oe')
    .replace(/Œ/g, 'OE')
    .replace(/[“|”]/g, '')
    .replace(/’/g, '\'');

/* regular expression (from user search query input) */
const regex = query => new RegExp(`\\b(${query})\\b`, 'gi');

/* paragraphs matching user's search query */
const search = (paragraphs, query) =>
  paragraphs.filter(paragraph => plain(paragraph.text).match(regex(query)));

/* display paragraph matching user's search query */
const result = (query, paragraph) =>
  block(`<p class="${paragraph.type}">${plain(paragraph.text).replace(regex(query), '<mark>$1</mark>')}</p>`, ref(paragraph));

/* display all paragraphs matching user's search query */
const results = (text, query) => {
  const haystack = paragraphs(text);
  const hits = search(haystack, query);
  const count = block('', `Query matched in ${hits.length} of ${haystack.length} paragraphs.`);
  return count + hits.map(result.bind(null, query)).join('');
};

/* breadcrumb for top of toolbox */
const breadcrumb = text =>
  (text.parent === undefined)
    ? `<h2><a href="${url(text.label)}">${text.title[0]}</a></h2>`
    : `${breadcrumb(texts[text.parent])}<h2><a href="${url(text.label)}">${text.title[0]}</a></h2>`;

/* bootstrap */
if ($('toolbox') && $('textbox')) {
  if (text) {
    $('title').innerHTML = breadcrumb(text);
    $('cog').addEventListener('click', (event) => {
      event.preventDefault();
      $('options').classList.toggle('hidden');
    });
    $('search').addEventListener('submit', (event) => {
      event.preventDefault();
      if ($('query').value.length > 0) {
        $('close').classList.remove('hidden');
        $('textbox-body').innerHTML = results(text, $('query').value);
      }
    });
    $('search').addEventListener('reset', (event) => {
      $('close').classList.add('hidden');
      $('textbox-body').innerHTML = display(text);
    });
    $('textbox-body').innerHTML = display(text);
  } else {
    $('textbox-body').innerHTML = '<p>Bad reference.</p>';
  }
  $('toolbox').classList.remove('hidden');
  $('textbox').classList.remove('hidden');
}
