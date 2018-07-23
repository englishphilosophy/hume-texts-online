const texts = ((session) => {

  const dom = {
    text: document.getElementById('text-pane'),
    edited: document.getElementById('show-edited'),
    breaks: document.getElementById('show-breaks'),
    changes: document.getElementById('show-changes'),
    tabs: Array.from(document.querySelectorAll('[data-show]')),
    panes: Array.from(document.querySelectorAll('.tab-pane')),
  };

  const toggle = (what, element) => {
    if (element.getAttribute('data-show') === what || element.id === what) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  };

  const show = what => {
    dom.tabs.forEach(toggle.bind(null, what));
    dom.panes.forEach(toggle.bind(null, what));
  };

  const update = (option = null) => {
    if (option) session.toggle(option);
    if (session.get('show-edited')) {
      dom.text.classList.remove('original');
      dom.changes.disabled = false;
      dom.changes.parentElement.classList.remove('disabled');
    } else {
      dom.text.classList.add('original');
      dom.changes.disabled = true;
      dom.changes.parentElement.classList.add('disabled');
    }
    if (session.get('show-breaks')) {
      dom.text.classList.add('breaks');
    } else {
      dom.text.classList.remove('breaks');
    }
    if (session.get('show-changes')) {
      dom.text.classList.add('changes');
    } else {
      dom.text.classList.remove('changes');
    }
  };

  const init = () => {
    // only setup on the texts page
    if (!dom.text) return;
    // update elements to match session variables
    dom.edited.checked = session.get('show-edited');
    dom.breaks.checked = session.get('show-breaks');
    dom.changes.checked = session.get('show-changes');
    // add event listeners
    dom.tabs.forEach(x => x.addEventListener('click', show.bind(null, x.getAttribute('data-show'))));
    dom.edited.addEventListener('change', update.bind(null, 'show-edited'));
    dom.breaks.addEventListener('change', update.bind(null, 'show-breaks'));
    dom.changes.addEventListener('change', update.bind(null, 'show-changes'));
    // update the text style to match session variables
    update();
  };

  return { init };

})(session);
