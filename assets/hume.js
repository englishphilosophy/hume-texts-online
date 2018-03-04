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
  if (get('original-edition') === null) set('original-edition', false);
  if (get('show-breaks') === null) set('show-breaks', false);
  if (get('show-changes') === null) set('show-changes', false);
  if (get('simple-search') === null) set('simple-search', true);
  if (get('ignore-punctuation') === null) set('ignore-punctuation', true);
  if (get('match-related') === null) set('match-related', true);
  return { set: set, get: get };
})();

const prepare = ((data, options) => {
  const edition = content =>
    options.get('original-edition')
      ? content.replace(/<ins( title='(.*?)')?>(.*?)<\/ins>/g, '')
      : content.replace(/<del( title='(.*?)')?>(.*?)<\/del>/g, '');
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
    (options.get('simple-search') && options.get('ignore-punctuation'))
      ? prepare.plainer(content)
      : prepare.plain(content);
  const simplify = query => {
    var simplified = query;
    if (options.get('ignore-punctuation')) {
      simplified = prepare.plainer(simplified);
    }
    if (options.get('match-related')) {
      simplified = simplified.replace(/(ct|x)ion\b/g, '(ction|xion)')
        .replace(/\bcould\b/g, 'coul|\'d')
        .replace(/\bshould\b/g, 'shoul|\'d')
        .replace(/\bwould\b/g, 'woul|\'d')
        .replace(/ied\b/g, '((ied)|(y\'d))')
        .replace(/ed\b/g, '(ed|\'d)')
        .replace(/though\b/g, 'tho((oug)|\')')
        .replace(/\bbetw((ixt)|(een))\b/g, 'betw((ixt)|(een))')
        .replace(/\bdispatch(t|(ed))\b/g, 'dispatch(t|(ed))')
        .replace(/\bit ((is)|(was)|(were))\b/g, '((it $1)|(\'t$1))');
    }
    return simplified;
  };
  const regex = query =>
    options.get('simple-search') ? new RegExp(`(${simplify(query)})`, 'gi') : new RegExp(`(${query})`, 'gi');
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
    const text = data.text($('tools').getAttribute('data-text'));
    const blocks = data.blocks(text);
    const hits = search.filter(blocks, $('query').value);
    $('results').innerHTML = display.summary(hits, blocks)
      + display.blocks(hits, $('query').value);
    show('results');
  };
  const updateText = () => {
    if (options.get('original-edition')) {
      $('text').classList.add('original');
    } else {
      $('text').classList.remove('original');
    }
    if (options.get('show-breaks')) {
      $('text').classList.add('breaks');
    } else {
      $('text').classList.remove('breaks');
    }
    if (options.get('show-changes')) {
      $('text').classList.add('changes');
    } else {
      $('text').classList.remove('changes');
    }
  };
  const init = () => {
    if ($('tools')) {
      $$('.tab').forEach(x => x.addEventListener('click', clickTab));
      $('search').addEventListener('submit', submitSearch);
      $('original-edition').checked = options.get('original-edition');
      $('edited-edition').checked = !options.get('original-edition');
      $('show-breaks').checked = options.get('show-breaks');
      $('show-changes').checked = options.get('show-changes');
      $('simple-search').checked = options.get('simple-search');
      $('advanced-search').checked = !options.get('simple-search');
      $('ignore-punctuation').checked = options.get('ignore-punctuation');
      $('match-related').checked = options.get('match-related');
      $('original-edition').addEventListener('change', () => {
        options.set('original-edition', $('original-edition').value);
        updateText();
      });
      $('edited-edition').addEventListener('change', () => {
        options.set('original-edition', !$('original-edition').value);
        updateText();
      });
      $('show-breaks').addEventListener('change', () => {
        options.set('show-breaks', $('show-breaks').value);
        updateText();
      });
      $('show-changes').addEventListener('change', () => {
        options.set('show-changes', $('show-changes').value);
        updateText();
      });
      $('simple-search').addEventListener('change', () => {
        options.set('simple-search', $('simple-search').value);
      });
      $('advanced-search').addEventListener('change', () => {
        options.set('advanced-search', $('advanced-search').value);
      });
      $('ignore-punctuation').addEventListener('change', () => {
        options.set('ignore-punctuation', $('ignore-punctuation').value);
      });
      $('match-related').addEventListener('change', () => {
        options.set('match-related', $('match-related').value);
      });
      updateText();
    }
  };
  return { init: init };
})(data);

page.init();
