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
    $$('.tab').forEach(toggleTab.bind(null, what));
    $$('.tab-pane').forEach(togglePane.bind(null, what));
  };

  const clickTab = (event) => {
    show(event.currentTarget.getAttribute('data-show'));
  };

  // keep reference to previous hits in page scope, for searching within results
  let hits;

  const getBlocks = () => {
    const text = $('tools').getAttribute('data-text');
    const custom = $$('[data-search]')
      .filter(x => x.checked)
      .map(x => x.getAttribute('data-search'));
    switch (options.get('search-range')) {
      case 'custom':
        return data.some(custom);
      case 'results':
        return hits;
      default:
        return (text === 'all') ? data.all : data.one(text);
    }
  };

  const submitSearch = (event) => {
    if (event && event.type === 'submit') event.preventDefault();
    show('results-pane');
    if ($('query').value.length > 0) {
      const blocks = options.get('search-variants')
        ? getBlocks()
        : getBlocks().filter(x => !x.variant);
      $('summary').innerHTML = 'searching...';
      $('results').innerHTML = '';
      hits = search.filter(blocks, $('query').value);
      $('summary').innerHTML = display.summary(hits, blocks);
      $('results').innerHTML = display.blocks(hits, $('query').value);
      Array.from($('results').querySelectorAll('a')).forEach((x) => {
        x.addEventListener('click', (e) => { page.show('text-pane'); });
      });
    } else {
      $('summary').innerHTML = 'Enter your query into the search box above, and press ENTER or click the search icon to see results.';
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

  const setSearchOption = (option) => {
    if ([ 'current', 'results', 'custom' ].indexOf(option) > -1) {
      options.set('search-range', option);
      if (option === 'custom') {
        toggleCustomRange(true);
      } else {
        toggleCustomRange(false);
      }
    } else {
      options.set(option, $(option).checked);
    }
    submitSearch();
  };

  const updateText = () => {
    if (options.get('show-edited')) {
      $('text').classList.remove('original');
      $('show-changes').disabled = false;
      $('show-changes').parentElement.classList.remove('disabled');
    } else {
      $('text').classList.add('original');
      $('show-changes').disabled = true;
      $('show-changes').parentElement.classList.add('disabled');
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

  const setTextOption = (option) => {
    options.set(option, $(option).checked);
    updateText();
  };

  const toggleAllTexts = (event) => {
    if (event.currentTarget.checked) {
      $$('[data-search]').forEach(x => x.checked = true);
    } else {
      $$('[data-search]').forEach(x => x.checked = false);
    }
  };

  const init = () => {
    $('search-advanced').checked = options.get('search-advanced');
    $('show-edited').checked = options.get('show-edited');
    $('show-breaks').checked = options.get('show-breaks');
    $('show-changes').checked = options.get('show-changes');
    $('search-current').checked = (options.get('search-range') === 'current');
    $('search-results').checked = (options.get('search-range') === 'results');
    $('search-custom').checked = (options.get('search-range') === 'custom');
    $('search-variants').checked = options.get('search-variants');
    if (options.get('search-range') === 'custom') toggleCustomRange(true);
    $$('.tab').forEach(x => x.addEventListener('click', clickTab));
    $('query').addEventListener('focus', show.bind(null, 'results-pane'));
    $('search').addEventListener('submit', submitSearch);
    $('search-advanced').addEventListener('change', setSearchOption.bind(null, 'search-advanced'));
    $('show-edited').addEventListener('change', setTextOption.bind(null, 'show-edited'));
    $('show-breaks').addEventListener('change', setTextOption.bind(null, 'show-breaks'));
    $('show-changes').addEventListener('change', setTextOption.bind(null, 'show-changes'));
    $('search-current').addEventListener('change', setSearchOption.bind(null, 'current'));
    $('search-results').addEventListener('change', setSearchOption.bind(null, 'results'));
    $('search-custom').addEventListener('change', setSearchOption.bind(null, 'custom'));
    $('search-variants').addEventListener('change', setSearchOption.bind(null, 'search-variants'));
    $('search-all').addEventListener('change', toggleAllTexts);
    $('search-all').addEventListener('change', submitSearch);
    $$('[data-search]').forEach(x => x.addEventListener('click', submitSearch));
    updateText();
  };

  return init;

})(data, options, search, display);
