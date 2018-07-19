const display = ((data) => {

  const summary = (hits, blocks) =>
    `<p>Query matched ${hits.length} of ${blocks.length} paragraphs or notes.</p>`;

  const url = text =>
    `{{ site.baseurl }}/texts/${text.label.toLowerCase().replace(/(\.|-)/g, '/')}`;

  const id = block =>
    (block.type === 'note') ? `n${block.id}` : block.id;

  const label = block =>
    `${block.section}.${id(block)}`.replace('.', ' ');

  const pages = block =>
    block.pages ? `, ${block.reference} ${block.pages}` : '';

  const ref = block =>
    `<a href="${url(data.text(block.section))}/#${id(block)}">${label(block)}${pages(block)}</a>`;

  const block = (query, block) =>
    `<div class="block ${block.type}">
      <div class="meta">${ref(block)}</div>
      <div class="content">${prepare.display(block.content).replace(search.regex(query), '<mark>$&</mark>')}</div>
    </div>`;

  const blocks = (blocks, query) =>
    blocks.map(block.bind(null, query)).join('');

  return { summary, blocks };

})(data);
