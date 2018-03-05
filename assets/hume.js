---
layout: null
---
const data = (() => {
  const texts = {{ site.data | jsonify }};
  const id = label =>
    label.toLowerCase().replace(/\./g, '-');
  const text = label =>
    texts[id(label)];
  const augment = (text, block) =>
    Object.assign({ section: text.label, reference: text.pages }, block);
  const augmented = (text, blocks) =>
    blocks ? blocks.map(augment.bind(null, text)) : [];
  const blocks = text =>
    text.paragraphs
      ? augmented(text, text.paragraphs).concat(augmented(text, text.notes))
      : text.texts.map(x => blocks(texts[x])).reduce((y, z) => y.concat(z), []);
  return { text: text, blocks: blocks };
})();

const options = (() => {
  const set = (item, value) =>
    localStorage.setItem(item, JSON.stringify(value));
  const get = item =>
    JSON.parse(localStorage.getItem(item));
  if (get('advanced') === null) set('advanced', false);
  if (get('edited') === null) set('edited', true);
  if (get('changes') === null) set('changes', false);
  if (get('breaks') === null) set('breaks', false);
  return { set: set, get: get };
})();

const prepare = ((data, options) => {
  const edition = content =>
    options.get('edited')
      ? content.replace(/<del( title='(.*?)')?>(.*?)<\/del>/g, '')
      : content.replace(/<ins( title='(.*?)')?>(.*?)<\/ins>/g, '');
  const rich = content =>
    edition(content).replace(/<sup>(.*?)<\/sup>/g, '')
      .replace(/<span class='page-break'>\|<\/span>/g, '')
      .replace(/<span class='marker'>(.*?)<\/span>/g, '');
  const plain = content =>
    rich(content).replace(/(<([^>]+)>)/g, '').replace(/\s\s/g, ' ').trim();
  const plainer = content =>
    plain(content).replace(/[.,;:?!]/g, '');
  const words = text =>
    data.blocks(text).map(x => plain(x.content).split(' ').length).reduce((y, z) => y + z, 0);
  return { rich: rich, plain: plain, plainer: plainer, words: words };
})(data, options);

const search = ((options, prepare) => {
  const searchable = content =>
    (options.get('advanced'))
      ? prepare.plain(content)
      : prepare.plainer(content);
  const simplify = query =>
    prepare.plainer(query).replace(/(ct|x)ion\b/g, '(ction|xion)')
      .replace(/\bcould\b/g, 'coul|\'d')
      .replace(/\bshould\b/g, 'shoul|\'d')
      .replace(/\bwould\b/g, 'woul|\'d')
      .replace(/ied\b/g, '((ied)|(y\'d))')
      .replace(/ed\b/g, '(ed|\'d)')
      .replace(/though\b/g, 'tho((oug)|\')')
      .replace(/\bbetw((ixt)|(een))\b/g, 'betw((ixt)|(een))')
      .replace(/\bdispatch(t|(ed))\b/g, 'dispatch(t|(ed))')
      .replace(/\bit ((is)|(was)|(were))\b/g, '((it $1)|(\'t$1))');
  const regex = query =>
    options.get('advanced')
      ? new RegExp(`(${query})`, 'gi')
      : new RegExp(`(${simplify(query)})`, 'gi');
  const filter = (blocks, query) =>
    blocks.filter(x => searchable(x.content).match(regex(query)));
  return { regex: regex, filter: filter };
})(options, prepare);

const display = ((data) => {
  const summary = (hits, blocks) =>
    `<div class="block">
      <div class="meta"><p>Query matched ${hits.length} of ${blocks.length} paragraphs or notes.</p></div>
      <div class="content"></div>
    </div>`;
  const url = text =>
    `{{ site.baseurl }}/texts/${text.label.toLowerCase().replace(/(\.|-)/g, '/')}`;
  const label = block =>
    `${block.section}.${block.id}`.replace('.', ' ');
  const pages = block =>
    block.pages ? `, ${block.reference} ${block.pages}` : '';
  const ref = block =>
    `<a href="${url(data.text(block.section))}/#${block.id}">${label(block)}${pages(block)}</a>`;
  const block = (query, block) =>
    `<div class="block">
      <div class="meta">${ref(block)}</div>
      <div class="content ${block.type}">${prepare.rich(block.content).replace(search.regex(query), '<mark>$1</mark>')}</div>
    </div>`;
  const blocks = (blocks, query) =>
    blocks.map(block.bind(null, query)).join('');
  return { summary: summary, blocks: blocks };
})(data);

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
    if ($('query').value.length > 0) {
      const text = data.text($('tools').getAttribute('data-text'));
      const blocks = data.blocks(text);
      const hits = search.filter(blocks, $('query').value);
      $('results').innerHTML = display.summary(hits, blocks) + display.blocks(hits, $('query').value);
    } else {
      $('results').innerHTML = `<div class="meta"><p>Enter your query into the search box above, and press ENTER or click the search icon to see results.</p></div>`;
    }
    show('results');
  };
  const updateText = () => {
    if (options.get('edited')) {
      $('text').classList.remove('original');
      $('changes').disabled = false;
      $('changes').parentElement.classList.remove('disabled');
    } else {
      $('text').classList.add('original');
      $('changes').disabled = true;
      $('changes').parentElement.classList.add('disabled');
    }
    if (options.get('breaks')) {
      $('text').classList.add('breaks');
    } else {
      $('text').classList.remove('breaks');
    }
    if (options.get('changes')) {
      $('text').classList.add('changes');
    } else {
      $('text').classList.remove('changes');
    }
  };
  const init = () => {
    if ($('tools')) {
      $$('.tab').forEach(x => x.addEventListener('click', clickTab));
      $('search').addEventListener('submit', submitSearch);
      $('advanced').checked = options.get('advanced');
      $('edited').checked = options.get('edited');
      $('breaks').checked = options.get('breaks');
      $('changes').checked = options.get('changes');
      $('advanced').addEventListener('change', () => {
        options.set('advanced', $('advanced').checked);
      });
      $('edited').addEventListener('change', () => {
        options.set('edited', $('edited').checked);
        updateText();
      });
      $('breaks').addEventListener('change', () => {
        options.set('breaks', $('breaks').checked);
        updateText();
      });
      $('changes').addEventListener('change', () => {
        options.set('changes', $('changes').checked);
        updateText();
      });
      updateText();
    }
  };
  return { init: init };
})(data);

page.init();
