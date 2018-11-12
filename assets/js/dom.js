// set a session variable
export const set = (item, value) => {
  switch (item) {
    case 'show-edited': // fallthrough
    case 'show-changes': // fallthrough
    case 'show-breaks':
      window.localStorage.setItem(item, JSON.stringify(value))
      break
    default:
      window.sessionStorage.setItem(item, JSON.stringify(value))
      break
  }
}

// get a session variable
export const get = item =>
  JSON.parse(window.localStorage.getItem(item) || window.sessionStorage.getItem(item))

// toggle a (boolean) session variable
export const toggle = item => {
  set(item, !get(item))
}

// dom elements
export const tabs = Array.from(document.querySelectorAll('[data-show]'))
export const panes = Array.from(document.querySelectorAll('.tab-pane'))
export const jumpForm = document.getElementById('jump-form')
export const jumpInput = document.getElementById('jump-input')
export const textPane = document.getElementById('text-pane')
export const showEdited = document.getElementById('show-edited')
export const showBreaks = document.getElementById('show-breaks')
export const showChanges = document.getElementById('show-changes')
export const search = document.getElementById('search')
export const query = document.getElementById('query')
export const newSearch = document.getElementById('new-search')
export const subSearch = document.getElementById('sub-search')
export const searchSimple = document.getElementById('search-simple')
export const searchAdvanced = document.getElementById('search-advanced')
export const searchEdited = document.getElementById('show-edited')
export const searchVariants = document.getElementById('search-variants')
export const searchAll = document.getElementById('search-all')
export const searchTexts = Array.from(document.querySelectorAll('[data-search]'))
export const summary = document.getElementById('summary')
export const hits = document.getElementById('hits')

// show a tab
export const showTab = which => {
  const toggle = (element) => {
    if (element.getAttribute('data-show') === which || element.id === which) {
      element.classList.add('active')
    } else {
      element.classList.remove('active')
    }
  }
  tabs.forEach(toggle)
  panes.forEach(toggle)
}

// update text display
export const updateText = () => {
  if (get('show-edited')) {
    textPane.classList.remove('original')
    showChanges.disabled = false
    showChanges.parentElement.classList.remove('disabled')
  } else {
    textPane.classList.add('original')
    showChanges.disabled = true
    showChanges.parentElement.classList.add('disabled')
  }
  if (get('show-breaks')) {
    textPane.classList.add('breaks')
  } else {
    textPane.classList.remove('breaks')
  }
  if (get('show-changes')) {
    textPane.classList.add('changes')
  } else {
    textPane.classList.remove('changes')
  }
}

// show search results
export const showResults = (results, rangeLength, regex, advanced, edited) => {
  summary.innerHTML = advanced
    ? `<p>Advanced search matched ${results.length} of ${rangeLength} paragraphs or notes.</p>`
    : `<p>Simple search matched ${results.length} of ${rangeLength} paragraphs or notes.</p>`
  hits.innerHTML = results.map(block => showBlock(block, regex, edited)).join('')
  subSearch.removeAttribute('style')
  showTab('results')
}

// functions needed by showResults function
const showBlock = (block, regex, edited) =>
  `<div class="${classes(block)}">
    <div class="meta">${ref(block)}</div>
    <div class="content">
      ${content(block).replace(regex, '<mark>$&</mark>')}
    </div>
  </div>`

const classes = block =>
  block.type ? `block ${block.type}` : 'block'

const ref = block =>
  block.pages
    ? `<a href="${block.url}#${block.id}">${label(block)}, ${block.pages}</a>`
    : `<a href="${block.url}#${block.id}">${label(block)}</a>`

const label = block =>
  `${block.text}.${block.id}`.replace('.', ' ')

const content = (block, edited) =>
  edited ? block.edited.rich : block.original.rich
