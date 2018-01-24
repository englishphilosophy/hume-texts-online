const text = document.querySelector('[data-id]');
const xhttp = new XMLHttpRequest();

const line = (text) =>
  text.replace(/<#[0-9]*?>/g, '')
    .replace(/<SBN#[0-9]*?>/g, '')
    .replace(/~(.*?)~/g, '<span class="wide">$1</span>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/\*(.*?)\*/g, '<em class="sc">$1</em>')
    .replace(/\^(.)/g, '<span class="dc">$1</span>')
    .replace(/^# (.*?)$/g, '<h1>$1</h1>')
    .replace(/^## (.*?)$/g, '<h2>$1</h2>')
    .replace(/^### (.*?)$/g, '<h3>$1</h3>')
    .replace(/^#### (.*?)$/g, '<h4>$1</h4>');

const paragraph = (text) => {
  const lines = text.split('\n');
  const info = lines.shift();
  const id = info.replace(/ \[(.*?)\]$/, '');
  const matches = info.match(/ \[(.*?)\]$/, '');
  const type = matches ? matches[1] : 'normal';
  const div = (type === 'title') ? '' : `<div class="ref" id="${id}">${id}</div>`;
  const p = `<p class="${type}">${lines.map(line).join('<br>')}</p>`;
  return div + p;
};

const prepare = (text) =>
  text.split('\n\n').map(paragraph).join('');

const show = () => {
  if (xhttp.readyState === 4 && xhttp.status === 200) {
    text.innerHTML = prepare(xhttp.responseText);
  }
};

if (text) {
  xhttp.onreadystatechange = show;
  xhttp.open('GET', '/assets/texts/' + text.getAttribute('data-id') + '.txt', true);
  xhttp.send();
}
