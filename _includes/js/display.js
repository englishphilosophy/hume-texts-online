const display = ((options, search) => {

  const summary = (hits, blocks) =>
    `<p>Query matched ${hits.length} of ${blocks.length} paragraphs or notes.</p>`;

  const url = block =>
    `{{ site.baseurl }}/texts/${block.text.toLowerCase().replace(/\./g, '/')}`;

  const label = block =>
    `${block.text}.${block.id}`.replace('.', ' ');

  const ref = block =>
    block.pages
      ? `<a href="${url(block)}/#${block.id}">${label(block)} ${block.pages}</a>`
      : `<a href="${url(block)}/#${block.id}">${label(block)}</a>`;

  const classes = block =>
    block.type ? `block ${block.type}` : 'block';

  const content = block =>
    options.get('show-edited') ? block.edited.rich : block.original.rich;

  const block = (query, block) =>
    `<div class="${classes(block)}">
      <div class="meta">${ref(block)}</div>
      <div class="content">
        ${content(block).replace(search.regex(query), '<mark>$&</mark>')}
      </div>
    </div>`;

  const blocks = (blocks, query) =>
    blocks.map(block.bind(null, query)).join('');

  return { summary, blocks };

})(options, search);
