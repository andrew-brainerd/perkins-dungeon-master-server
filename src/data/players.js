const _ = require('lodash');
const data = require('../utils/data');
const auth = require('../utils/auth');
const { PLAYERS_COLELCTION, CHARACTERS_COLLECTION } = require('../constants/collections');

const createPlayer = player => {
  const newPlayer = {
    email: player.email,
     ...auth.encryptPassword(player.password),
  };

  return new Promise((resolve, reject) => {
    data.db.collection(PLAYERS_COLELCTION)
      .insertOne(newPlayer, (err, { ops }) => {
        err ? reject(err) : resolve(ops[0]);
      });
  });
};

const getPlayerByEmail = email => {
  return new Promise((resolve, reject) => {
    data.db.collection(PLAYERS_COLELCTION)
      .find({ email })
      .project({ password: 0 })
      .toArray((err, result) =>
        err ? reject(err) : resolve(result[0])
      );
  });
};

const createCharacter = newCharacter => {
  return new Promise((resolve, reject) =>
    data.db.collection(CHARACTERS_COLLECTION)
      .insertOne(newCharacter, (err, { ops }) => {
        err ? reject(err) : resolve(ops[0]);
      })
  );
};

const getCharactersForPlayer = playerId => {
  return new Promise((resolve, reject) => {
    data.db.collection(CHARACTERS_COLLECTION)
      .find({ playerId })
      .project({ password: 0 })
      .toArray((err, result) =>
        err ? reject(err) : resolve(result)
      );
  });
}

/** Grody prototype method. Returns the player and a token if they exist and passwords match.
 *  Othersise undefined.
 */
const login = async (email, password) => {
  try {
    const player = await getPlayerByEmail(email);
    if (!auth.validateLogin(player, password)) {
      return undefined;
    }

    return {
      token: auth.generateJWT(player),
      player: _.pick(player, '_id', 'email', 'characters'),
    };
  } catch (e) {
    return undefined;
  }
}

module.exports = {
  createPlayer,
  createCharacter,
  getCharactersForPlayer,
  getPlayerByEmail,
  login,
};
