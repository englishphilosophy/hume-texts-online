const data = (() => {

  const texts = {{ site.data.texts | jsonify }};

  const id = label =>
    label.toLowerCase().replace(/\./g, '-');

  const text = label =>
    texts[id(label)];

  const augment = (text, isnote, block) =>
    isnote
      ? Object.assign({ section: text.label, reference: text.pages, type: 'note' }, block)
      : Object.assign({ section: text.label, reference: text.pages }, block);

  const augmented = (text, blocks, isnote) =>
    blocks ? blocks.map(augment.bind(null, text, isnote)) : [];

  const blocks = (text, variants) => {
    if (text.texts) {
      return text.texts.map(x => blocks(texts[x])).reduce((y, z) => y.concat(z), []);
    } else if (text.variants && variants) {
      const variantsArray = text.variants.map(v => v.paragraphs).reduce((y, z) => y.concat(z), []);
      return augmented(text, text.paragraphs, false)
        .concat(augmented(text, text.notes, true))
        .concat(augmented(text, variantsArray, false));
    } else {
      return augmented(text, text.paragraphs, false)
        .concat(augmented(text, text.notes, true));
    }

    text.paragraphs
      ? augmented(text, text.paragraphs, false).concat(augmented(text, text.notes, true))
      : text.texts.map(x => blocks(texts[x])).reduce((y, z) => y.concat(z), []);
  };

  return { text, blocks };

})();
