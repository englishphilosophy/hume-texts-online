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
        search.newSearch(query.value).then((r) => {
          results = r
          showSearchResults(results)
        })
      } else {
        results = search.subSearch(query.value, results)
        showSearchResults(results)
      }
    }
  }

  // define function for displaying search results
  const showSearchResults = (results) => {
    summary.innerHTML = `Search query matched ${results.length} paragraphs.`
    hits.innerHTML = results.map(search.display.bind(null, query.value)).join('')
    subSearch.style.display = 'block'
    try {
      session.set('summary-html', summary.innerHTML)
      session.set('hits-html', hits.innerHTML)
    } catch (ignore) {
      summary.innerHTML += '<br><br><strong>Note:</strong> There are too many results to be saved in this session; leaving this page will clear your results.'
      session.set('last-query', null)
      session.set('summary-html', null)
      session.set('hits-html', null)
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

  // show results of last search when the page first loads
  if (session.get('last-query')) {
    query.value = session.get('last-query')
    summary.innerHTML = session.get('summary-html')
    hits.innerHTML = session.get('hits-html')
    view.activate('results')
  }
}
