const display = ((options, search) => {

  const summary = (hits, blocks) =>
    options.get('search-advanced')
      ? `<p>Advanced search matched ${hits.length} of ${blocks.length} paragraphs or notes. Advanced search uses <em>regular expressions</em> for pattern matching. See the <a href="{{ site.baseurl }}/notes/help#3-simple-and-advanced-search">Help</a> page for more information.</p>`
      : `<p>Simple search matched ${hits.length} of ${blocks.length} paragraphs or notes. See the <a href="{{ site.baseurl }}/notes/help#3-simple-and-advanced-search">Help</a> page for advice on how to search effectively.</p>`;

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
