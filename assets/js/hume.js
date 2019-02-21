---
---
import jump from './jump.js?v={{ site.version }}'
import * as search from './search.js?v={{ site.version }}'
import * as session from './session.js?v={{ site.version }}'
import * as view from './view.js?v={{ site.version }}'

// setup event listeners for toggles
Array.from(document.querySelectorAll('[data-toggle]')).forEach((element) => {
  element.addEventListener('click', (e) => { view.toggle(e.currentTarget) })
})

// setup event listeners for tabs
Array.from(document.querySelectorAll('[data-tab]')).forEach((element) => {
  element.addEventListener('click', (e) => { view.tab(e.currentTarget) })
})

// setup inputs bound to session variables
Array.from(document.querySelectorAll('[data-session]')).forEach((input) => {
  input.addEventListener('change', (e) => { session.toggle(input.dataset.session) })
})

// setup jump form
const jumpForm = document.getElementById('jump-form')
const jumpInput = document.getElementById('jump-input')
if (jumpForm) {
  jumpForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (jumpInput.value.length > 0) jump(jumpInput.value)
  })
}

// setup search form
const searchForm = document.getElementById('search-form')
const subSearch = document.getElementById('sub-search')
const query = document.getElementById('search-input')
const summary = document.getElementById('summary')
const hits = document.getElementById('hits')
if (searchForm) {
  // keep reference to previous results around for future sub searches
  let results

  // define search function
  const doSearch = (newSearch) => {
    if (query.value.length > 0) {
      session.set('last-query', query.value)
      summary.innerHTML = 'Searching...'
      hits.innerHTML = ''
      view.activate('results')
      if (newSearch) {
        search.newSearch(query.value).then((res) => {
          results = res
          summary.innerHTML = `Search query matched ${results.length} paragraphs.`
          hits.innerHTML += results.map(search.display.bind(null, query.value)).join('')
          subSearch.style.display = 'block'
        })
      } else {
        results = search.subSearch(query.value, results)
        summary.innerHTML = `Search query matched ${results.length} paragraphs.`
        hits.innerHTML += results.map(search.display.bind(null, query.value)).join('')
      }
    }
  }

  // setup new search
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    doSearch(true)
  })

  // setup sub search
  subSearch.addEventListener('click', (e) => {
    e.preventDefault()
    doSearch(false)
  })

  // rerun last search when the page first loads
  if (session.get('last-query')) {
    query.value = session.get('last-query')
    doSearch(true)
  }
}
