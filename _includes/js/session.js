const session = (() => {

  const set = (item, value) => {
    switch (item) {
      case 'show-edited': // fallthrough
      case 'show-changes': // fallthrough
      case 'show-breaks':
        localStorage.setItem(item, JSON.stringify(value));
        break;
      case 'search-advanced': // fallthrough
      case 'search-variants': // fallthrough
      case 'search-all': // fallthrough
      case 'search-t-0': // fallthrough
      case 'search-t-1': // fallthrough
      case 'search-t-2': // fallthrough
      case 'search-t-3': // fallthrough
      case 'search-t-app': // fallthrough
      case 'search-a': // fallthrough
      case 'search-l': // fallthrough
      case 'search-e': // fallthrough
      case 'search-p': // fallthrough
      case 'search-m': // fallthrough
      case 'search-n': // fallthrough
      case 'search-h': // fallthrough
      case 'search-d': // fallthrough
      case 'search-essays': // fallthrough
      case 'search-ads': // fallthrough
      case 'search-query': // fallthrough
      case 'search-hits': // fallthrough
      case 'search-blocks-length':
        sessionStorage.setItem(item, JSON.stringify(value));
        break;
      default:
        break;
    }
  };

  const get = item =>
    JSON.parse(localStorage.getItem(item) || sessionStorage.getItem(item));

  const toggle = item => {
    set(item, !get(item));
  };

  if (get('show-edited') === null) set('show-edited', true);
  if (get('show-changes') === null) set('show-changes', false);
  if (get('show-breaks') === null) set('show-breaks', false);

  if (get('search-advanced') === null) set('search-advanced', false);
  if (get('search-variants') === null) set('search-variants', true);
  if (get('search-all') === null) set('search-all', true);
  if (get('search-t-0') === null) set('search-t-0', true);
  if (get('search-t-1') === null) set('search-t-1', true);
  if (get('search-t-2') === null) set('search-t-2', true);
  if (get('search-t-3') === null) set('search-t-3', true);
  if (get('search-t-app') === null) set('search-t-app', true);
  if (get('search-a') === null) set('search-a', true);
  if (get('search-l') === null) set('search-l', true);
  if (get('search-e') === null) set('search-e', true);
  if (get('search-p') === null) set('search-p', true);
  if (get('search-m') === null) set('search-m', true);
  if (get('search-n') === null) set('search-n', true);
  if (get('search-h') === null) set('search-h', true);
  if (get('search-d') === null) set('search-d', true);
  if (get('search-essays') === null) set('search-essays', true);
  if (get('search-ads') === null) set('search-ads', true);

  return { set, get, toggle };

})();
