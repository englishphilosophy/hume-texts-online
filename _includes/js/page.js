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
    switch (options.get('search')) {
      case 'custom':
        return custom.map(data.text)
          .map(x => data.blocks(options.get('variants'), x))
          .reduce((x, y) => x.concat(y), []);
      case 'results':
        return hits;
      default:
        return data.blocks(data.text(text), options.get('variants'));
    }
  };

  const submitSearch = (event) => {
    if (event && event.type === 'submit') event.preventDefault();
    if ($('query').value.length > 0) {
      const blocks = getBlocks();
      hits = search.filter(blocks, $('query').value);
      $('summary').innerHTML = display.summary(hits, blocks);
      $('results').innerHTML = display.blocks(hits, $('query').value);
      Array.from($('results').querySelectorAll('a')).forEach((x) => {
        x.addEventListener('click', (e) => { page.show('text-pane'); });
      });
    } else {
      getBlocks();
      $('summary').innerHTML = 'Enter your query into the search box above, and press ENTER or click the search icon to see results.';
    }
    show('results-pane');
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
      options.set('search', option);
      if (option === 'custom') {
        toggleCustomRange(true);
      } else {
        toggleCustomRange(false);
      }
    } else {
      options.set(option, $(`search-${option}`).checked);
    }
    submitSearch();
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

  const setTextOption = (option) => {
    options.set(option, $(options).checked);
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
    $('advanced').checked = options.get('advanced');
    $('edited').checked = options.get('edited');
    $('breaks').checked = options.get('breaks');
    $('changes').checked = options.get('changes');
    $('search-current').checked = (options.get('search') === 'current');
    $('search-results').checked = (options.get('search') === 'results');
    $('search-custom').checked = (options.get('search') === 'custom');
    $('search-variants').checked = options.get('variants');
    if (options.get('search') === 'custom') toggleCustomRange(true);
    $$('.tab').forEach(x => x.addEventListener('click', clickTab));
    $('search').addEventListener('submit', submitSearch);
    $('advanced').addEventListener('change', setSearchOption.bind(null, 'advanced'));
    $('edited').addEventListener('change', setTextOption.bind(null, 'edited'));
    $('breaks').addEventListener('change', setTextOption.bind(null, 'breaks'));
    $('changes').addEventListener('change', setTextOption.bind(null, 'changes'));
    $('search-current').addEventListener('change', setSearchOption.bind(null, 'current'));
    $('search-results').addEventListener('change', setSearchOption.bind(null, 'results'));
    $('search-custom').addEventListener('change', setSearchOption.bind(null, 'custom'));
    $('search-variants').addEventListener('change', setSearchOption.bind(null, 'variants'));
    $('search-all').addEventListener('change', toggleAllTexts);
    $('search-all').addEventListener('change', submitSearch);
    $$('[data-search]').forEach(x => x.addEventListener('click', submitSearch));
    updateText();
  };

  return { show, init };

})(data, options, search, display);
