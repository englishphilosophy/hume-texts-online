const data = (() => {

  const texts = {{ site.data.texts | jsonify }};

  const baseContent = (content, edited) =>
    edited
      ? content.replace(/<del( title=['"](.*?)['"])?>(.*?)<\/del>/g, '')
      : content.replace(/<ins( title=['"](.*?)['"])?>(.*?)<\/ins>/g, '');

  const richContent = (content, edited) =>
    baseContent(content, edited)
      .replace(/<sup>(.*?)<\/sup>/g, '')
      .replace(/<span class=['"]margin-comment['"]>(.*?)<\/span>/g, '')
      .replace(/<span class=['"]page-break['"]>\|<\/span>/g, '')
      .replace(/\s\s/g, ' ')
      .trim();

  const plainContent = (content, edited) =>
    richContent(content, edited)
      .replace(/(<(.*?)>)/g, '')
      .replace(/\s\s/g, ' ')
      .trim();

  const wordCount = content =>
    content.split(' ').length;

  const tourl = label =>
    label.toLowerCase().replace(/(\.|\-)/g, '/');

  const url = text =>
    text.parent
      ? `${tourl(text.parent)}/${tourl(text.label)}`
      : tourl(text.label);

  const fullContent = (content, edited) => {
    const rich = richContent(content, edited);
    const plain = plainContent(content, edited);
    const words = wordCount(plain);
    return { rich, plain, words };
  };

  const prepare = (text, note, variant, block) =>
    ({
      text: text.label,
      id: note ? `n${block.id}` : block.id,
      url: `{{ site.baseurl }}/texts/${url(text)}`,
      pages: block.pages ? `${text.pages} ${block.pages}` : '',
      type: block.type,
      note,
      variant,
      original: fullContent(block.content, false),
      edited: fullContent(block.content, true),
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

  const words = (id) =>
    ({
      original: one(id).map(x => x.original.words).reduce((x, y) => x + y, 0),
      edited: one(id).map(x => x.edited.words).reduce((x, y) => x + y, 0),
    });

  return { all, one, some, words };

})();
