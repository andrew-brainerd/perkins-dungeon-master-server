const { values } = require('ramda');
const { characters } = require('gm-common');

const getClassFromType = classType =>
  values(characters.classes).find(charClass => charClass.value === classType);

const getRaceFromType = raceType =>
  values(characters.races).find(race => race.value === raceType);

module.exports = {
  getClassFromType,
  getRaceFromType
};
