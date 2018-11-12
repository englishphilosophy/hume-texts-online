import * as dom from './dom.js'
import * as search from './search.js'

// load text data for searching and paragraph lookup
let texts, blocks
window.fetch('/assets/js/data.json').then((response) => {
  if (response.status === 200) {
    response.json().then((data) => {
      texts = data
      blocks = search.prepare(texts)
    })
  }
})

// define the search function
let results // keep around for searches within current results
const doSearch = (newSearch) => {
  if (dom.query.value.length > 0) {
    // try again in 10ms if paragraph data is not yet ready
    if (blocks === undefined) {
      window.setTimeout(doSearch.bind(null, newSearch), 10)
      return
    }
    const regex = search.regex(dom.query.value)
    const ids = dom.searchTexts.filter(x => x.checked).map(x => x.getAttribute('data-search'))
    const range = newSearch
      ? search.range(texts, blocks, ids, dom.get('search-variants'))
      : results
    results = search.results(range, regex, dom.get('edited'))
    dom.showResults(results, range.length, regex)
    dom.set('search-query', dom.query.value)
    dom.set('search-hits', results)
    dom.set('search-blocks-length', range.length)
  }
}

// define jump function
const jump = () => {
  if (dom.jumpInput.value.length > 0) {
    // try again in 10ms if paragraph data is not yet ready
    if (blocks === undefined) {
      window.setTimeout(jump, 10)
      return
    }
    const id = dom.jumpInput.value.replace(' ', '.').toLowerCase()
    // look for text
    const text = texts[id.replace(/\./g, '-')]
    if (text) {
      window.location.hash = ''
      window.location.pathname = search.textUrl(text)
      return
    }
    // look for paragraph/note
    const block = blocks.find(x => `${x.text}.${x.id}`.toLowerCase() === id)
    if (block) {
      window.location.hash = block.id
      window.location.pathname = block.url
      return
    }
    window.alert('This does not appear to be a valid reference.')
  }
}

// set session variable defaults if they are not yet set
if (dom.get('show-edited') === null) dom.set('show-edited', true)
if (dom.get('show-changes') === null) dom.set('show-changes', false)
if (dom.get('show-breaks') === null) dom.set('show-breaks', false)
if (dom.get('search-advanced') === null) dom.set('search-advanced', false)
if (dom.get('search-variants') === null) dom.set('search-variants', true)
if (dom.get('search-all') === null) dom.set('search-all', true)
if (dom.get('search-t-0') === null) dom.set('search-t-0', true)
if (dom.get('search-t-1') === null) dom.set('search-t-1', true)
if (dom.get('search-t-2') === null) dom.set('search-t-2', true)
if (dom.get('search-t-3') === null) dom.set('search-t-3', true)
if (dom.get('search-t-app') === null) dom.set('search-t-app', true)
if (dom.get('search-a') === null) dom.set('search-a', true)
if (dom.get('search-l') === null) dom.set('search-l', true)
if (dom.get('search-e') === null) dom.set('search-e', true)
if (dom.get('search-p') === null) dom.set('search-p', true)
if (dom.get('search-m') === null) dom.set('search-m', true)
if (dom.get('search-n') === null) dom.set('search-n', true)
if (dom.get('search-h') === null) dom.set('search-h', true)
if (dom.get('search-d') === null) dom.set('search-d', true)
if (dom.get('search-essays') === null) dom.set('search-essays', true)
if (dom.get('search-ads') === null) dom.set('search-ads', true)

// setup tabs
dom.tabs.forEach((x) => {
  x.addEventListener('click', (e) => {
    dom.showTab(x.getAttribute('data-show'))
  })
})

// setup jump box
dom.jumpForm.addEventListener('submit', (e) => {
  e.preventDefault()
  jump()
})

// setup a page with a text
if (dom.textPane) {
  // update elements to match session variables
  dom.showEdited.checked = dom.get('show-edited')
  dom.showBreaks.checked = dom.get('show-breaks')
  dom.showChanges.checked = dom.get('show-changes')
  // add event listeners
  dom.showEdited.addEventListener('change', () => {
    dom.toggle('show-edited')
    dom.updateText()
  })
  dom.showBreaks.addEventListener('change', () => {
    dom.toggle('show-breaks')
    dom.updateText()
  })
  dom.showChanges.addEventListener('change', () => {
    dom.toggle('show-changes')
    dom.updateText()
  })
  // update the text style to match session variables
  dom.updateText()
}

// setup the search page
if (dom.search) {
  // update elements to match session variables
  dom.searchAll.checked = dom.get('search-all')
  dom.searchTexts.forEach(x => { x.checked = dom.get(x.id) })
  dom.searchSimple.checked = !dom.get('search-advanced')
  dom.searchAdvanced.checked = dom.get('search-advanced')
  dom.showEdited.checked = dom.get('show-edited')
  dom.searchVariants.checked = dom.get('search-variants')
  // add event listeners
  dom.searchAll.addEventListener('change', (e) => {
    dom.toggle('search-all')
    dom.searchTexts.forEach((x) => { x.checked = e.currentTarget.checked })
    dom.searchTexts.forEach((x) => { dom.set(x.id, false) })
  })
  dom.searchTexts.forEach((x) => {
    x.addEventListener('change', (e) => { dom.toggle(x.id) })
  })
  dom.searchSimple.addEventListener('change', (e) => {
    dom.toggle('search-advanced')
  })
  dom.searchAdvanced.addEventListener('change', (e) => {
    dom.toggle('search-advanced')
  })
  dom.showEdited.addEventListener('change', (e) => {
    dom.toggle('show-edited')
  })
  dom.searchVariants.addEventListener('change', (e) => {
    dom.toggle('search-variants')
  })
  // new search
  dom.search.addEventListener('submit', (e) => {
    e.preventDefault()
    doSearch(true)
  })
  // search within current results
  dom.subSearch.addEventListener('click', (e) => {
    e.preventDefault()
    doSearch(false)
  })
  // maybe preload previous search results
  if (dom.get('search-query') !== null) {
    dom.query.value = dom.get('search-query')
    results = dom.get('search-hits')
    dom.showResults(results, dom.get('search-blocks-length'), search.regex(dom.query.value))
  }
}
