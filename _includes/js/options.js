/* site wide options (saved to local storage) */
((store, texts) => {

  /* set option value */
  const set = (item, value) => {
    store.setItem(item, JSON.stringify(value));
  };

  /* get option value */
  const get = (item) => {
    return JSON.parse(store.getItem(item));
  };

  /* toggle option value */
  const toggle = (item) => {
    set(item, !get(item));
  };

  /* set default option values if they haven't yet been set */
  if (get('breaks') === null) set('breaks', false);
  if (get('edits') === null) set('edits', false);
  texts.forEach((text) => {
    if (get(text.id) === null) set(text.id, true);
  });

  /* expose the setter and getter */
  return { set: set, get: get, toggle: toggle };

})(window.localStorage, texts);
