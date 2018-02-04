const query = document.getElementById('query');
const close = document.getElementById('close');
const search = document.getElementById('search');
const results = document.getElementById('results');
const hits = document.getElementById('hits');

const format = (text) =>
  text.replace(/<#[0-9]*?>/g, '')
    .replace(/<SBN#[0-9]*?>/g, '')
    .replace(/~(.*?)~/g, '<span class="wide">$1</span>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/\*(.*?)\*/g, '<em class="sc">$1</em>')
    .replace(/\^(.*?)\^/g, '<span class="dc">$1</span>');

const plain = (text) =>
  text.replace(/_/g, '')
    .replace(/\*/g, '')
    .replace(/^/g, '')
    .replace(/~/g, '')
    .replace(/<#[0-9]*?>/g, '')
    .replace(/<SBN#[0-9]*?>/g, '');

const find = (query) => {
  const regex = new RegExp(`\\b${query}\\b`, 'gi');
  return paragraphs.filter(paragraph => plain(paragraph.text).match(regex));
};

Array.from(document.querySelectorAll('.paragraph')).forEach((node) => {
  node.innerHTML = format(node.innerHTML);
});

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
