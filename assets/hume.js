---
layout: null
---
const data = (() => {
  const texts = {{ site.data | jsonify }};
  const id = label =>
    label.toLowerCase().replace(/\./g, '-');
  const text = label =>
    texts[id(label)];
  const augment = (text, paragraph) =>
    Object.assign({ section: text.label, reference: text.pages }, paragraph);
  const paragraphs = text =>
    text.paragraphs
      ? text.paragraphs.map(augment.bind(null, text))
      : text.texts.map(x => paragraphs(texts[x])).reduce((y, z) => y.concat(z), []);
  const words = text =>
    paragraphs(text).map(x => x.text.replace(/(<([^>]+)>)/g, '').split(' ')).reduce((y, z) => y.concat(z), []);
  return { text: text, paragraphs: paragraphs, words: words };
})();

const options = (() => {
  const set = (item, value) =>
    localStorage.setItem(item, JSON.stringify(value));
  const get = item =>
    JSON.parse(localStorage.getItem(item));
  if (get('original') === null) set('original', false);
  if (get('changes') === null) set('changes', false);
  if (get('font') === null) set('font', 'imfell');
  return { set: set, get: get };
})();

const display = ((data) => {
  const summary = (hits, paragraphs) =>
    `<div class="block">
      <div class="meta"><p>Query matched ${hits.length} of ${paragraphs.length} paragraphs.</p></div>
      <div class="content"></div>
    </div>`;
  const url = text =>
    `{{ site.baseurl }}/texts/${text.label.toLowerCase().replace(/(\.|-)/g, '/')}`;
  const label = paragraph =>
    `${paragraph.section}.${paragraph.id}`.replace('.', ' ');
  const pages = paragraph =>
    paragraph.pages ? `, ${paragraph.reference} ${paragraph.pages}` : '';
  const ref = paragraph =>
    `<a href="${url(data.text(paragraph.section))}/#${paragraph.id}">${label(paragraph)}${pages(paragraph)}</a>`;
  const regex = query =>
    new RegExp(`\\b(${query})\\b`, 'gi');
  const paragraph = (query, paragraph) =>
    `<div class="block">
      <div class="meta">${ref(paragraph)}</div>
      <div class="content ${paragraph.type}">${paragraph.text.replace(regex(query), '<mark>$1</mark>')}</div>
    </div>`;
  const paragraphs = (paragraphs, query) =>
    paragraphs.map(paragraph.bind(null, query)).join('');
  return { summary: summary, paragraphs: paragraphs };
})(data);

const search = ((options) => {
  const plain = text =>
    options.get('original')
      ? text.replace(/\<ins( title='.*?')?\>(.*?)\<\/ins\>/g, '').replace(/(<([^>]+)>)/g, '')
      : text.replace(/\<del( title='.*?')?\>(.*?)\<\/del\>/g, '').replace(/(<([^>]+)>)/g, '');
  const regex = query =>
    new RegExp(`\\b(${query})\\b`, 'gi');
  const filter = (paragraphs, query) =>
    (query.length > 0)
      ? paragraphs.filter(paragraph => plain(paragraph.text).match(regex(query)))
      : [];
  return { filter: filter };
})(options);

const page = ((data) => {
  const $ = id =>
    document.getElementById(id);
  const $$ = selector =>
    Array.from(document.querySelectorAll(selector));
  const toggleTab = (what, tab) =>
    (tab.getAttribute('data-show') === what) ? tab.classList.add('active') : tab.classList.remove('active');
  const togglePane = (what, pane) =>
    (pane.id === what) ? pane.classList.remove('hidden') : pane.classList.add('hidden');
  const show = what => {
    $$('.tab').forEach(toggleTab.bind(null, what));
    $$('.tab-pane').forEach(togglePane.bind(null, what));
  };
  const clickTab = (event) => {
      show(event.currentTarget.getAttribute('data-show'));
    };
  const submitSearch = (event) => {
    event.preventDefault();
    const text = data.text($('tools').getAttribute('data-text'));
    const paragraphs = data.paragraphs(text);
    const hits = search.filter(paragraphs, $('query').value);
    $('results').innerHTML = display.summary(hits, paragraphs)
      + display.paragraphs(hits, $('query').value);
    show('results');
  };
  const init = () => {
    if ($('tools')) {
      $$('.tab').forEach(x => x.addEventListener('click', clickTab));
      $('search').addEventListener('submit', submitSearch);
    }
  };
  return { init: init };
})(data);

page.init();
