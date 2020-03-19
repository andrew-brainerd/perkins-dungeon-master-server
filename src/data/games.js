const { v1: uuidv1 } = require('uuid');
const { isEmpty } = require('ramda');
const data = require('../utils/data');
const log = require('../utils/log');
const { pusher } = require('../utils/pusher');
const { UPDATE_GAME } = require('../constants/pusher');
const { GAMES_COLLECTION } = require('../constants/collections');
const { AUTH_USER, GAME_MASTER } = require('../constants/game');

const createGame = async (name, createdBy) => {
  const newGame = await data.insertOne(
    GAMES_COLLECTION, {
    name,
    createdBy,
    members: [createdBy]
  });

  log.success(`Created new game ${newGame.name} (${newGame._id})`);

  return newGame;
};

const getGames = async (page, size, playerEmail) => {
  return await data.getSome(GAMES_COLLECTION, page, size, 'createdBy', playerEmail);
};

const getGame = async gameId => {
  return await data.getById(GAMES_COLLECTION, gameId);
};

const getGameCharacters = async gameId => {
  const game = await getGame(gameId);
  const characters = ((game || {}).characters) || [];

  return characters;
};

const addLog = async (gameId, message) => {
  const serverResponse = await parsePlayerInput(message);
  const appendPlayerMessage = await data.updateOne(GAMES_COLLECTION, gameId, message);
  const appendServerMessage = await data.updateOne(GAMES_COLLECTION, gameId, serverResponse);

  pusher.trigger(gameId, UPDATE_GAME, { appendPlayerMessage, appendServerMessage });

  return {
    gameId,
    playerMessage: message,
    playerMessageStatus: appendPlayerMessage,
    serverMessageStatus: appendServerMessage
  };
};

const getUniqueMessage = message => ({
  messages: {
    id: uuidv1(),
    timestamp: new Date(),
    ...message
  }
});

const parsePlayerInput = async playerInput => {
  const { messages: { gameId, message } } = playerInput || {};

  if (message === 'login' || message === 'signin') {
    return getUniqueMessage({
      ...AUTH_USER,
      message: message.isAuthenticated ? 'Already signed in :D' : 'Signing In...'
    });
  } else if (message === 'logout' || message === 'signout') {
    return getUniqueMessage({
      ...AUTH_USER,
      message: message.isAuthenticated ? 'Signing Out...' : 'Not signed in'
    });
  } else if (message === 'newgame') {
    if (message.isAuthenticated) {
      return getUniqueMessage({
        ...GAME_MASTER,
        message: 'Starting a new game...'
      });
    } else {
      return getUniqueMessage({
        ...AUTH_USER,
        message: 'Please sign in first'
      });
    }
  } else if (message === 'char' || message === 'characters') {
    const characters = await getGameCharacters(gameId);

    return getUniqueMessage({
      ...GAME_MASTER,
      message: !isEmpty(characters) ?
        `Game Characters:
        <pre>
        ${characters.map(({ name }) =>
          `<span>Name: </span><span>${name}</span>`)
        }
        </pre>` :
        'No characters in this game yet'
    });
  } else if (message === 'newCharacter') {
    return getUniqueMessage({
      ...GAME_MASTER,
      message: 'Create A New Character',
      requiresPlayerInput: true
    });
  }

  return getUniqueMessage({
    ...GAME_MASTER,
    message: 'Unrecognized player input'
  });
};

module.exports = {
  createGame,
  getGames,
  getGame,
  getGameCharacters,
  addLog
};
