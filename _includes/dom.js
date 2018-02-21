(() => {

  return {
    sections: Array.from(document.querySelectorAll('[data-section]')),
    toggles: Array.from(document.querySelectorAll('[data-toggle]')),
    query: document.getElementById('query'),
    close: document.getElementById('close'),
    search: document.getElementById('search'),
    results: document.getElementById('results'),
    hits: document.getElementById('hits')
  };

})();
