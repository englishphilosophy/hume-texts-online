const prepare = ((data, options) => {

  const edition = content =>
    options.get('edited')
      ? content.replace(/<del( title='(.*?)')?>(.*?)<\/del>/g, '')
      : content.replace(/<ins( title='(.*?)')?>(.*?)<\/ins>/g, '');

  const rich = content =>
    edition(content).replace(/<sup>(.*?)<\/sup>/g, '')
      .replace(/<span class='page-ref'>(.*?)<\/span>/g, '')
      .replace(/<span class='page-break'>\|<\/span>/g, '');

  const plain = content =>
    rich(content).replace(/(<(.*?)>)/g, '').replace(/\s\s/g, ' ').trim();

  const display = content =>
    plain(rich(content).replace(/<(\/?(p|blockquote))>/g, '@$1@')).replace(/@(.*?)@/g, '<$1>');

  const words = text =>
    data.blocks(text).map(x => plain(x.content).split(' ').length).reduce((y, z) => y + z, 0);

  return { rich, plain, display, words };

})(data, options);
