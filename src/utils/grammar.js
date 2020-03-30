const articleForNoun = noun => {
  if (!noun || noun === '') {
    return 'an';
  }

  return ['a', 'e', 'i', 'o', 'u'].includes(noun.toLowerCase()[0]) ? 'an' : 'a';
};

const withUnits = (value, unit) => {
    return `${value}${value === 1 ? unit.singular : unit.plural}`;
};

module.exports = {
    articleForNoun,
    withUnits
};
