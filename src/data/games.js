const { v1: uuidv1 } = require('uuid');
const { isEmpty } = require('ramda');
const { syncing, characters } = require('gm-common');
const data = require('../utils/data');
const log = require('../utils/log');
const { pusher } = require('../utils/pusher');
const { GAMES_COLLECTION, CHARACTERS_COLLECTION } = require('../constants/collections');
const { command, Format, processText, CommandResult } = require('directo');

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

const getGames = async (page, size, playerId) => {
  return await data.getSome(GAMES_COLLECTION, page, size, 'createdBy', playerId);
};

const getGame = async gameId => {
  return await data.getById(GAMES_COLLECTION, gameId);
};

const getGameCharacters = async gameId => {
  return await data.getSome(CHARACTERS_COLLECTION, 1, 50, 'gameId', gameId);
};

const addLog = async (gameId, message) => {
  const serverResponse = await parsePlayerInput(message);
  const appendPlayerMessage = await data.updateOne(GAMES_COLLECTION, gameId, message);
  const appendServerMessage = await data.updateOne(GAMES_COLLECTION, gameId, serverResponse);

  pusher.trigger(gameId, syncing.UPDATE_GAME, { appendPlayerMessage, appendServerMessage });

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

command({
  verb: ['login', 'signin'],
  accept: [Format.V],
  async func({ context }) {
    const { playerInput } = context;
    context.response = getUniqueMessage({
      ...characters.AUTH_USER,
      message: playerInput.messages.isAuthenticated ? 'Already signed in :D' : 'Signing In...'
    });

    return CommandResult.HANDLED;
  }
});

command({
  verb: ['logout', 'signout'],
  accept: [Format.V],
  async func({ context }) {
    const { playerInput } = context;
    context.response = getUniqueMessage({
      ...characters.AUTH_USER,
      message: playerInput.messages.isAuthenticated ? 'Signing Out...' : 'Not signed in'
    });

    return CommandResult.HANDLED;
  }
});

command({
  verb: 'newgame',
  accept: [Format.V],
  async func({ context }) {
    const { playerInput } = context;
    if (playerInput.messages.isAuthenticated) {
      context.response = getUniqueMessage({
        ...characters.GAME_MASTER,
        message: 'Starting a new game...'
      });
    } else {
      context.response = getUniqueMessage({
        ...characters.AUTH_USER,
        message: 'Please sign in first'
      });
    }

    return CommandResult.HANDLED;
  }
});

command({
  verb: ['char', 'characters'],
  accept: [Format.V],
  async func({ context }) {
    const { playerInput } = context;
    const characters = await getGameCharacters(playerInput.messages.gameId);
    const gameCharacters = characters.items || [];


    let serverMessage = '';
    gameCharacters.map(({ name, class: charClass, race, level, ...rest }) => {
      serverMessage += '<div style="border: 1px dashed white; padding: 15px;">';
      console.log({ name, ...rest });
      serverMessage += `<div>${name}</div>`;
      serverMessage += `<div>Level ${level} ${race} ${charClass}</div>`;
      serverMessage += '</div>';
    }
    );

    context.response = getUniqueMessage({
      message: !isEmpty(gameCharacters) ?
        serverMessage :
        'No characters in this game yet'
    });

    return CommandResult.HANDLED;
  }
});

command({
  verb: ['newCharacter'],
  accept: [Format.V],
  async func({ context }) {
    context.response = getUniqueMessage({
      ...characters.GAME_MASTER,
      message: 'Create A New Character',
      requiresPlayerInput: true
    });

    return CommandResult.HANDLED;
  }
});

const parsePlayerInput = async playerInput => {
  const { messages: { message } } = playerInput || {};
  const processContext = { playerInput };

  const processResult = await processText(message, processContext);
  if (processResult === CommandResult.HANDLED) {
    return processContext.response;
  }

  return getUniqueMessage({
    ...characters.GAME_MASTER,
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
