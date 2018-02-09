// convert text into HTML formatted text (for display)
const format = (text) =>
  text.replace(/~(.*?)~/g, '<span class="wide">$1</span>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/\*(.*?)\*/g, '<em class="sc">$1</em>')
    .replace(/\^(.*?)\^/g, '<span class="dc">$1</span>')
    .replace(/`(.*?)`/g, '<blockquote>$1</blockquote>')
    .replace(/\/\//g, '<br>')
    .replace(/¬/g, '<span class="tab"></span>')
    .replace(/\[(\d+),..?\]/g, '<sup>[$1]</sup>')
    .replace(/\|/g, '<span class="page-break">|</span>')
    .replace(/\[-(.*?) +(.*?) @(.*?)\]/g, '<del>$1</del><ins title="$3">$2</ins>');

// convert text to plain text (for searching)
const plain = (text) =>
  text.replace(/~/g, '')
    .replace(/_/g, '')
    .replace(/\*/g, '')
    .replace(/\^/g, '')
    .replace(/`/g, '')
    .replace(/\/\//g, ' ')
    .replace(/¬/g, '')
    .replace(/\[(\d+),..?\]/g, '')
    .replace(/<\/>/g, '')
    .replace(/\|/g, '')
    .replace(/\[-(.*?) +(.*?) @(.*?)\]/g, '$2');

// search paragraphs
const find = (query) => {
  const regex = new RegExp(`\\b${query}\\b`, 'gi');
  return data.filter(p => plain(p.text).match(regex));
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
          hits.innerHTML += `<p>${format(paragraph.text)}</p>`;
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
