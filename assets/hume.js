// getters and setters for local storage variables
const set = (item, value) => {
  localStorage.setItem(item, JSON.stringify(value));
};
const get = (item) => {
  return JSON.parse(localStorage.getItem(item));
};

// set default local storage values if they haven't yet been set
set('breaks', get('breaks') || false);
set('edits', get('edits') || false);
set('search', get('search') || ['t0', 't1', 't2', 't3', 'tapp', 'a', 'l', 'e', 'm', 'n', 'p', 'd', 'ess1', 'ess2', 'ess3', 'other']);

// convert text into HTML formatted text (for display)
const format = (text) =>
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

// convert text to plain text (for searching)
const plain = (text) =>
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

// create full HTML display of a paragraph (for showing search results)
const display = (paragraph) => {
  return `<div><div class="ref"><a href="texts/${paragraph.page}#${paragraph.id}">${paragraph.id}</a></div><p class="${paragraph.type}">${format(paragraph.text)}</p></div>`;
};

// search paragraphs
const find = (query) => {
  const regex = new RegExp(`\\b${query}\\b`, 'gi');
  return get('search')
    .map(x => data[x].filter(p => plain(p.text).match(regex)))
    .reduce((a, b) => a.concat(b));
};

// parts of the page for formatting
const toFormat = Array.from(document.querySelectorAll('[data-format]'));

// apply the formatting
toFormat.forEach((x) => { x.innerHTML = format(x.innerHTML); });

// parts of the page for the search funtionality
const query = document.getElementById('query');
const close = document.getElementById('close');
const search = document.getElementById('search');
const results = document.getElementById('results');
const hits = document.getElementById('hits');

// apply the search functionality
if (search) {
  search.addEventListener('submit', (e) => {
    e.preventDefault();
    if (query.value.length > 0) {
      const matches = find(query.value);
      if (matches.length > 0) {
        hits.innerHTML = '';
        matches.forEach((paragraph) => {
          hits.innerHTML += `<hr>${display(paragraph)}`;
        });
      } else {
        hits.innerHTML = '<p>No matches found.</p>';
      }
      results.classList.remove('hidden');
      close.classList.remove('hidden');
    }
  });
  search.addEventListener('reset', (e) => {
    results.classList.add('hidden');
    close.classList.add('hidden');
  });
}
