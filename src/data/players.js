const _ = require('lodash');
const data = require('../utils/data');
const auth = require('../utils/auth');
const { PLAYERS_COLELCTION } = require('../constants/collections');

const createPlayer = player => {
  const newPlayer = {
    email: player.email,
    characters: [],
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

/** Grody prototype method. Returns the player and a token if they exist and passwords match.
 *  Othersise undefined.
 */
const login = async (email, password) => {
  try {
    const player = await getPlayerByEmail(email);
    if (!auth.validateLogin(player, password)) {
      return undefined;
    }

    const token = auth.generateJWT(player);
    const sanitizedPlayer = _.pick(player, '_id', 'email', 'characters');
    return {
      token,
      player: sanitizedPlayer,
    };
  } catch (e) {
    return undefined;
  }
}

module.exports = {
  createPlayer,
  getPlayerByEmail,
  login,
};
