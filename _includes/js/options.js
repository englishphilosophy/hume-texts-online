const options = (() => {

  const set = (item, value) =>
    localStorage.setItem(item, JSON.stringify(value));

  const get = item =>
    JSON.parse(localStorage.getItem(item));

  if (get('advanced') === null) set('advanced', false);

  if (get('edited') === null) set('edited', true);

  if (get('changes') === null) set('changes', false);

  if (get('breaks') === null) set('breaks', false);

  if (get('search') === null) set('search', 'current');

  if (get('variants') === null) set('variants', true);

  return { set, get };

})();
