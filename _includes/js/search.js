const search = ((session) => {

  const simplify = query =>
    query.replace(/[.,;:?!]/g, '')
      .replace(/(ct|x)ion\b/g, '(ct|x)ion')
      .replace(/ould\b/g, 'ou(l|\')d')
      .replace(/ied\b/g, '(ied|y\'d)')
      .replace(/ed\b/g, '(ed|\'d)')
      .replace(/though\b/g, 'tho(ugh|\')')
      .replace(/\bbetw(ixt|een)\b/g, 'betw(ixt|een)')
      .replace(/\bdispatch(t|ed)\b/g, 'dispatch(t|ed)')
      .replace(/\bstop(t|ed)\b/g, 'stop(t|ed)')
      .replace(/phenomen/g, 'ph(e|ae)nomen')
      .replace(/ae/g, '(ae|æ)')
      .replace(/economy/g, '(e|oe)conomy')
      .replace(/oe/g, '(oe|œ)')
      .replace(/\ba\b/g, '(a|à)')
      .replace(/\bit (is|was|were)\b/g, '(it $1|\'t$1)')
      .replace(/\s/g, '[.,;:?!]? ');

  const regex = query =>
    session.get('search-advanced')
      ? new RegExp(`(${query})`, 'gi')
      : new RegExp(`\\b(${simplify(query)})\\b`, 'gi');

  const filter = (blocks, query) =>
    session.get('show-edited')
      ? blocks.filter(x => x.edited.plain.match(regex(query)))
      : blocks.filter(x => x.original.plain.match(regex(query)));

  const dom = {
    search: document.getElementById('search'),
    query: document.getElementById('query'),
    showHelp: document.getElementById('show-help'),
    subSearch: document.getElementById('sub-search'),
    simple: document.getElementById('search-simple'),
    advanced: document.getElementById('search-advanced'),
    edited: document.getElementById('show-edited'),
    variants: document.getElementById('search-variants'),
    all: document.getElementById('search-all'),
    texts: Array.from(document.querySelectorAll('[data-search]')),
    help: document.getElementById('help'),
    results: document.getElementById('results'),
    summary: document.getElementById('summary'),
    hits: document.getElementById('hits'),
  };

  const showSummary = (hitsLength, blocksLength) =>
    session.get('search-advanced')
      ? `<p>Advanced search matched ${hitsLength} of ${blocksLength} paragraphs or notes.</p>`
      : `<p>Simple search matched ${hitsLength} of ${blocksLength} paragraphs or notes.</p>`;

  const label = block =>
    `${block.text}.${block.id}`.replace('.', ' ');

  const ref = block =>
    block.pages
      ? `<a href="${block.url}#${block.id}">${label(block)} ${block.pages}</a>`
      : `<a href="${block.url}#${block.id}">${label(block)}</a>`;

  const classes = block =>
    block.type ? `block ${block.type}` : 'block';

  const content = block =>
    session.get('show-edited') ? block.edited.rich : block.original.rich;

  const block = block =>
    `<div class="${classes(block)}">
      <div class="meta">${ref(block)}</div>
      <div class="content">
        ${content(block).replace(regex(dom.query.value), '<mark>$&</mark>')}
      </div>
    </div>`;

  const showHits = hits =>
    hits.map(block).join('');

  const newBlocks = texts =>
    session.get('search-variants')
      ? data.some(texts)
      : data.some(texts).filter(x => !x.variant);

  let hits;

  const showSearch = (hits, blocksLength) => {
    dom.summary.innerHTML = showSummary(hits.length, blocksLength);
    dom.hits.innerHTML = showHits(hits);
    dom.help.style.display = 'none';
    dom.results.style.display = 'block';
    dom.showHelp.style.display = 'block';
    dom.subSearch.style.display = 'block';
  };

  const runSearch = (newSearch) => {
    if (dom.query.value.length > 0) {
      const texts = dom.texts.filter(x => x.checked).map(x => x.getAttribute('data-search'));
      const blocks = newSearch ? newBlocks(texts) : hits.slice(0);
      hits = filter(blocks, dom.query.value);
      session.set('search-query', dom.query.value);
      session.set('search-hits', hits);
      session.set('search-blocks-length', blocks.length);
      showSearch(hits, blocks.length);
    } else {
      dom.summary.innerHTML = '';
      dom.hits.innerHTML = '';
      dom.results.style.display = 'none';
      dom.help.style.display = 'block';
      dom.showHelp.style.display = 'none';
      dom.subSearch.style.display = 'none';
      session.set('search-query', null);
      session.set('search-hits', null);
      session.set('search-blocks-length', null);
    }
  };

  const init = () => {
    // only setup on the search page
    if (!dom.search) return;
    // update elements to match session variables
    dom.all.checked = session.get('search-all');
    dom.texts.forEach(x => x.checked = session.get(x.id));
    dom.simple.checked = !session.get('search-advanced');
    dom.advanced.checked = session.get('search-advanced');
    dom.edited.checked = session.get('show-edited');
    dom.variants.checked = session.get('search-variants');
    // add event listeners
    dom.all.addEventListener('change', (e) => {
      session.toggle('search-all');
      if (e.currentTarget.checked) {
        dom.texts.forEach((x) => {
          x.checked = true;
          session.set(x.id, true);
        });
      } else {
        dom.texts.forEach((x) => {
          x.checked = false;
          session.set(x.id, false);
        });
      }
    });
    dom.texts.forEach(x => x.addEventListener('change', session.toggle.bind(null, x.id)));
    dom.simple.addEventListener('change', session.toggle.bind(null, 'search-advanced'));
    dom.advanced.addEventListener('change', session.toggle.bind(null, 'search-advanced'));
    dom.edited.addEventListener('change', session.toggle.bind(null, 'show-edited'));
    dom.variants.addEventListener('change', session.toggle.bind(null, 'search-variants'));
    dom.search.addEventListener('submit', (e) => {
      e.preventDefault();
      runSearch(true);
    });
    dom.showHelp.addEventListener('click', (e) => {
      e.preventDefault();
      dom.query.value = '';
      runSearch(false)
    });
    dom.subSearch.addEventListener('click', (e) => {
      e.preventDefault();
      runSearch(false)
    });
    // maybe preload previous search results
    if (session.get('search-query') !== null) {
      dom.query.value = session.get('search-query');
      hits = session.get('search-hits');
      showSearch(hits, session.get('search-blocks-length'));
    }
  };

  return { init };

})(session);
