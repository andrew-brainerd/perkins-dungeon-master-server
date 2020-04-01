const data = require('../utils/data');
const log = require('../utils/log');
const { CHARACTERS_COLLECTION } = require('../constants/collections');

// This is only here until character creation is stable.
// Once all characters in the system follow the required schema, it will no
// longer be necessary.
const supplementCharacter = character => {
  if (!character) {
    return undefined;
  }

  if (!character.inventory) {
    character.inventory = [];
  }

  return character;
}

const createCharacter = async character => {
  const newCharacter = await data.insertOne(CHARACTERS_COLLECTION, character);

  log.success(`Created new character ${newCharacter.name} (${newCharacter._id})`);

  return newCharacter;
};

const getGameCharacters = async (page, size, gameId) => {
  return await data.getSome(CHARACTERS_COLLECTION, page, size, 'gameId', gameId);
};

const getCharacter = async characterId => {
  return supplementCharacter(await data.getById(CHARACTERS_COLLECTION, characterId));
};

const getCharacterByName = async (name, gameId) => {
  return supplementCharacter(await data.getByProperties(CHARACTERS_COLLECTION, { name, gameId }));
}

const updateCharacter = async character => {
  return await data.saveObject(CHARACTERS_COLLECTION, character);
}

module.exports = {
  createCharacter,
  getGameCharacters,
  getCharacter,
  getCharacterByName,
  updateCharacter
};
