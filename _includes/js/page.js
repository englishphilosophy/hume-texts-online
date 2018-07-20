const page = ((data, options, search, display) => {

  const $ = id =>
    document.getElementById(id);

  const $$ = selector =>
    Array.from(document.querySelectorAll(selector));

  const toggleTab = (what, tab) => {
    if (tab.getAttribute('data-show') === what) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  };

  const togglePane = (what, pane) => {
    if (pane.id === what) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  };

  const show = what => {
    $$('[data-show]').forEach(toggleTab.bind(null, what));
    $$('.tab-pane').forEach(togglePane.bind(null, what));
  };

  const clickTab = (event) => {
    show(event.currentTarget.getAttribute('data-show'));
  };

  // keep reference to previous hits in page scope, for searching within results
  let hits;

  const getBlocks = () => {
    const specific = $$('[data-search]')
      .filter(x => x.checked)
      .map(x => x.getAttribute('data-search'));
    switch (options.get('search-range')) {
      case 'results':
        return hits;
      default:
        return data.some(specific);
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();
    if ($('query').value.length > 0) {
      const blocks = options.get('search-variants')
        ? getBlocks()
        : getBlocks().filter(x => !x.variant);
      $('help').style.display = 'none';
      $('summary').innerHTML = 'searching...';
      $('results').innerHTML = '';
      window.requestAnimationFrame(() => {
        hits = search.filter(blocks, $('query').value);
        $('summary').innerHTML = display.summary(hits, blocks);
        $('results').innerHTML = display.blocks(hits, $('query').value);
      });
    } else {
      $('summary').innerHTML = '';
      $('results').innerHTML = '';
      $('help').style.display = 'block';
    }
  };

  const toggleCustomRange = (active = null) => {
    if (active === null) {
      $('custom-range').classList.toggle('active');
      $('search-custom').parentElement.classList.toggle('active');
    } else if (active) {
      $('custom-range').classList.add('active');
      $('search-custom').parentElement.classList.add('active');
    } else {
      $('custom-range').classList.remove('active');
      $('search-custom').parentElement.classList.remove('active');
    }
  };

  const updateText = () => {
    if (options.get('show-edited')) {
      $('text-pane').classList.remove('original');
      $('show-changes').disabled = false;
      $('show-changes').parentElement.classList.remove('disabled');
    } else {
      $('text-pane').classList.add('original');
      $('show-changes').disabled = true;
      $('show-changes').parentElement.classList.add('disabled');
    }
    if (options.get('show-breaks')) {
      $('text-pane').classList.add('breaks');
    } else {
      $('text-pane').classList.remove('breaks');
    }
    if (options.get('show-changes')) {
      $('text-pane').classList.add('changes');
    } else {
      $('text-pane').classList.remove('changes');
    }
  };

  const toggleTextOption = (option) => {
    options.toggle(option);
    updateText();
  };

  const toggleAllTexts = (event) => {
    if (event.currentTarget.checked) {
      $$('[data-search]').forEach(x => x.checked = true);
    } else {
      $$('[data-search]').forEach(x => x.checked = false);
    }
  };

  const initText = () => {
    if (!$('breadcrumb')) return;
    $('show-original').checked = !options.get('show-edited');
    $('show-edited').checked = options.get('show-edited');
    $('show-breaks').checked = options.get('show-breaks');
    $('show-changes').checked = options.get('show-changes');
    $$('[data-show]').forEach(x => x.addEventListener('click', clickTab));
    $('show-original').addEventListener('change', toggleTextOption.bind(null, 'show-edited'));
    $('show-edited').addEventListener('change', toggleTextOption.bind(null, 'show-edited'));
    $('show-breaks').addEventListener('change', toggleTextOption.bind(null, 'show-breaks'));
    $('show-changes').addEventListener('change', toggleTextOption.bind(null, 'show-changes'));
    updateText();
  };

  const initSearch = () => {
    if (!$('search')) return;
    $('search-simple').checked = !options.get('search-advanced');
    $('search-advanced').checked = options.get('search-advanced');
    $('show-edited').checked = options.get('show-edited');
    $('search-variants').checked = options.get('search-variants');
    $('search').addEventListener('submit', submitSearch);
    $('search-simple').addEventListener('change', options.toggle.bind(null, 'search-advanced'));
    $('search-advanced').addEventListener('change', options.toggle.bind(null, 'search-advanced'));
    $('show-edited').addEventListener('change', options.toggle.bind(null, 'search-variants'));
    $('search-variants').addEventListener('change', options.toggle.bind(null, 'search-variants'));
    $('search-all').addEventListener('change', toggleAllTexts);
  };

  return { initText, initSearch };

})(data, options, search, display);
