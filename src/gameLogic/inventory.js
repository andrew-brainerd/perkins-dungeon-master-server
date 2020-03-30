const { updateCharacter } = require('../data/characters');
const { getItems } = require('../data/items');
const { CARRY_CAPACITY_SCALER } = require('../constants/magicNumbers');
const { keyBy } = require('lodash');

/**
 * Returns the given character's full inventory.
 */
const getInventory = async character => {
  const items = keyBy(await getItems(character.inventory), '_id');

  // Ensure output is 1:1 (duplicate items are actually duplicated)
  return character.inventory.map(x => items[x]);
};

/**
 * Returns a the current weight the character is carrying and theirmaximum carry capacity.
 */
const getCarryRatio = async character => {
  const currentInventory = await getInventory(character);
  // This number will need to include their current equipment
  const currentWeight = currentInventory.reduce((total, item) => total + item.weight, 0);
  return {current: currentWeight, max: character.abilityScores.strength * CARRY_CAPACITY_SCALER};
};

/**
 * Attempts to add the given item to the character's inventory.
 */
const addItemToInventory = async (character, item) => {
  const carryRatio = await getCarryRatio(character);

  if (item.weight + carryRatio.current > carryRatio.max) {
    return { added: false, carryRatio };
  }

  character.inventory.push(item._id);
  await updateCharacter(character);

  // Re-getting carry ratio in case other effects have been applied.
  return { added: true, carryRatio: await getCarryRatio(character) };
};

module.exports = {
  getInventory,
  getCarryRatio,
  addItemToInventory
};
