const data = (() => {

  const texts = {{ site.data.texts | jsonify }};

  const edition = (content, edited) =>
    edited
      ? content.replace(/<del( title='(.*?)')?>(.*?)<\/del>/g, '')
      : content.replace(/<ins( title='(.*?)')?>(.*?)<\/ins>/g, '');

  const rich = (content, edited) =>
    edition(content, edited).replace(/<sup>(.*?)<\/sup>/g, '')
      .replace(/<span class='page-ref'>(.*?)<\/span>/g, '')
      .replace(/<span class='page-break'>\|<\/span>/g, '');

  const plain = (content, edited) =>
    rich(content).replace(/(<(.*?)>)/g, '').replace(/\s\s/g, ' ').trim();

  const prepare = (text, note, variant, block) =>
    ({
      text: text.label,
      id: note ? `n${block.id}` : block.id,
      pages: block.pages ? `${text.pages} ${block.pages}` : '',
      type: block.type,
      note,
      variant,
      original: { rich: rich(block.content, false), plain: plain(block.content, false) },
      edited: { rich: rich(block.content, true), plain: plain(block.content, true) },
    });

  const blocks = (id) => {
    const text = texts[id];
    let result;
    if (text.texts) {
      return text.texts.map(blocks).reduce((y, z) => y.concat(z), []);
    }
    if (text.paragraphs) {
      result = text.paragraphs.map(prepare.bind(null, text, false, false));
    }
    if (text.notes) {
      result = result.concat(text.notes.map(prepare.bind(null, text, true, false)));
    }
    if (text.variants) {
      text.variants.forEach((variant) => {
        if (variant.paragraphs) {
          result = result.concat(variant.paragraphs.map(prepare.bind(null, text, false, true)));
        }
        if (variant.notes) {
          result = result.concat(variant.notes.map(prepare.bind(null, text, true, true)));
        }
      });
    }
    return result;
  };

  const labels = (id) => {
    const text = texts[id];
    return text.texts
      ? text.texts.map(labels).reduce((x, y) => x.concat(y), [])
      : [text.label];
  };

  const all = blocks('all');

  const one = (id) => {
    const arr = labels(id);
    return all.filter(x => arr.indexOf(x.text) > -1);
  };

  const some = (ids) =>
    ids.map(one).reduce((x, y) => x.concat(y), []);

  return { all, one, some };

})();
