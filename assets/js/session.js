// set a session variable
export const set = (item, value) => {
  window.localStorage.setItem(item, JSON.stringify(value))
  if (item === 'search-all') groups.forEach((id) => { set(`search-${id}`, value) })
  update()
}

// get a session variable
export const get = item =>
  JSON.parse(window.localStorage.getItem(item))

// get an array of texts in the current search range
export const getRange = () =>
  groups.filter(x => get(`search-${x}`))

// toggle a (boolean) session variable
export const toggle = item => {
  set(item, !get(item))
}

// text groups for searching
const groups = ['t0', 't1', 't2', 't3', 'tapp', 'a', 'l', 'e', 'p', 'm', 'n', 'h', 'd', 'essays', 'ads']

// function to update the page to reflect current state
const update = () => {
  const inputs = Array.from(document.querySelectorAll('[data-session]'))
  const textPane = document.getElementById('text-pane')
  const showChanges = document.getElementById('show-changes')
  inputs.forEach((input) => {
    input.checked = input.dataset.invert ? !get(input.dataset.session) : get(input.dataset.session)
  })
  if (textPane) {
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
}

// set session variable defaults if they are not yet set
if (get('show-edited') === null) set('show-edited', true)
if (get('show-changes') === null) set('show-changes', false)
if (get('show-breaks') === null) set('show-breaks', false)
if (get('search-advanced') === null) set('search-advanced', false)
if (get('search-variants') === null) set('search-variants', true)
if (get('search-all') === null) set('search-all', true)

// update the page to reflect current state
update()
