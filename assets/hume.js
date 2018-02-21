---
layout: null
---
const texts = {{ site.data.texts | jsonify }};
const sections = {{ site.data.sections | jsonify }};
const dom = {% include dom.js %}
const regex = {% include regex.js %}
const options = {% include options.js %}
const format = {% include format.js %}
const search = {% include search.js %}

dom.sections.forEach((div) => {
  const id = div.getAttribute('data-section');
  const section = sections[id];
  const css = id.split('-')[0];
  if (section.title) { // remove this later - every section should have a title
    div.innerHTML = `<div class="paragraph">${format.title(section.title[1])}</div>`;
  } else {
    div.innerHTML = '';
  }
  div.innerHTML += section.paragraphs.map(format.page.bind(null, section)).join('');
  div.classList.add(css);
  div.classList.remove('hidden');
});

const doSearch = () => {
  var hits = [];
  if (dom.query.value.length > 0) {
    dom.hits.innerHTML = '<p>Searching...</p>';
    dom.results.classList.remove('hidden');
    dom.close.classList.remove('hidden');
    hits = search(dom.query.value);
    if (hits.length > 0) {
      dom.hits.innerHTML = hits.map(format.search.bind(null, dom.query.value)).join('');
    } else {
      dom.hits.innerHTML = '<p>No results.</p>';
    }
  }
};

dom.toggles.forEach((x) => {
  const id = x.getAttribute('data-toggle');
  if (id === 'all') {
    x.checked = texts.length === texts.filter(text => options.get(text.id)).length;
    x.addEventListener('change', (event) => {
      texts.forEach(text => options.set(text.id, x.checked));
      dom.toggles.forEach(y => y.checked = x.checked);
      doSearch();
    });
  } else {
    x.checked = options.get(id);
    x.addEventListener('change', (event) => {
      options.toggle(id);
      doSearch();
    });
  }
});

if (dom.search) {
  dom.search.addEventListener('submit', (event) => {
    event.preventDefault();
    doSearch();
  });
  dom.search.addEventListener('reset', (event) => {
    dom.results.classList.add('hidden');
    dom.close.classList.add('hidden');
  });
}
