const search = ((options, prepare) => {

  const simplify = query =>
    query.replace(/[.,;:?!]/g, '')
      .replace(/(ct|x)ion\b/g, '(ct|x)ion')
      .replace(/ould\b/g, 'ou(l|\')d')
      .replace(/ied\b/g, '(ied|y\'d)')
      .replace(/ed\b/g, '(ed|\'d)')
      .replace(/though\b/g, 'tho(ugh|\')')
      .replace(/\bbetw(ixt|een)\b/g, 'betw(ixt|een)')
      .replace(/\bdispatch(t|ed)\b/g, 'dispatch(t|ed)')
      .replace(/\bstop(t|ed)\b/g, 'stop(t|ed)')
      .replace(/phenomen/g, 'ph(e|ae)nomen')
      .replace(/ae/g, '(ae|æ)')
      .replace(/economy/g, '(e|oe)conomy')
      .replace(/oe/g, '(oe|œ)')
      .replace(/\ba\b/g, '(a|à)')
      .replace(/\bit (is|was|were)\b/g, '(it $1|\'t$1)')
      .replace(/\s/g, '[.,;:?!]? ');

  const regex = query =>
    options.get('advanced')
      ? new RegExp(`(${query})`, 'gi')
      : new RegExp(`(${simplify(query)})`, 'gi');

  const filter = (blocks, query) =>
    blocks.filter(x => prepare.plain(x.content).match(regex(query)));

  return { regex, filter };

})(options, prepare);
