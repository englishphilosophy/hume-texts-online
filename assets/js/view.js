import { get } from './session.js'

// function to toggle an element
export const toggle = (element) => {
  const altcontent = element.dataset.altcontent
  const target = document.getElementById(element.dataset.toggle)
  element.dataset.altcontent = element.innerHTML
  element.innerHTML = altcontent
  element.classList.toggle('active')
  target.classList.toggle('active')
}

// function to switch tabs
export const tab = (element) => {
  const targetId = element.dataset.tab
  const group = element.dataset.group
  const domain = Array.from(document.querySelectorAll(`[data-group="${group}"]`))
  domain.forEach((el) => {
    if (targetId === el.id || targetId === el.dataset.tab) {
      el.classList.add('active')
    } else {
      el.classList.remove('active')
    }
  })
}

// function to activate a tab pane by its id
export const activate = (id) => {
  const element = document.getElementById(id)
  const group = element.dataset.group
  const domain = Array.from(document.querySelectorAll(`[data-group="${group}"]`))
  domain.forEach((el) => {
    if (id === el.id || id === el.dataset.tab) {
      el.classList.add('active')
    } else {
      el.classList.remove('active')
    }
  })
}
