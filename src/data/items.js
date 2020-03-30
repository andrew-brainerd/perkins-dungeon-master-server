const data = require('../utils/data');
const { ITEMS_COLLECTION } = require('../constants/collections');

const getItemByName = async name => {
  return await data.getByProperty(ITEMS_COLLECTION, 'name', name);
}

const getItems = async itemIds => {
  return await data.getAllByProperty(ITEMS_COLLECTION, '_id', { $in: itemIds });
}

module.exports = {
  getItemByName,
  getItems
};
