const data = require('../utils/data');
const log = require('../utils/log');
const { DUNGEONS_COLLECTION } = require('../constants/collections');

const createGame = (name, createdBy) => {
  return new Promise((resolve, reject) => {
    data.db && data.db.collection(DUNGEONS_COLLECTION)
      .insertOne({ name, createdBy, members: [createdBy] }, (err, { ops }) => {
        const newGame = ops[0];
        log.success(`Created new game ${newGame.name} (${newGame._id})`);
        err ? reject(err) : resolve(newGame);
      });
  });
};

module.exports = {
  createGame
};
