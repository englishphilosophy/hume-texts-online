const options = (() => {

  const set = (item, value) =>
    localStorage.setItem(item, JSON.stringify(value));

  const get = item =>
    JSON.parse(localStorage.getItem(item));

  if (get('search-advanced') === null) set('search-advanced', false);

  if (get('search-range') === null) set('search-range', 'current');

  if (get('search-variants') === null) set('search-variants', true);

  if (get('show-edited') === null) set('show-edited', true);

  if (get('show-changes') === null) set('show-changes', false);

  if (get('show-breaks') === null) set('show-breaks', false);

  return { set, get };

})();
