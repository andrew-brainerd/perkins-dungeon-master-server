const { v1: uuidv1 } = require('uuid');
const { isEmpty } = require('ramda');
const { syncing, characters } = require('gm-common');
const data = require('../utils/data');
const log = require('../utils/log');
const { pusher } = require('../utils/pusher');
const { GAMES_COLLECTION, CHARACTERS_COLLECTION } = require('../constants/collections');
const { command, Format, processText, CommandResult } = require('directo');
const { getCharacterByName } = require('./characters');
const { getItemByName } = require('./items');
const { articleForNoun, withUnits } = require('../utils/grammar');
const { addItemToInventory, getCarryRatio, getInventory } = require('../gameLogic/inventory');
const { getRaceFromType, getClassFromType } = require('../utils/characters');
const { WEIGHT } = require('../constants/units');

const createGame = async (name, createdBy) => {
  const newGame = await data.insertOne(
    GAMES_COLLECTION, {
    name,
    createdBy,
    players: [createdBy]
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

const deleteGame = async gameId => {
  return await data.deleteOne(GAMES_COLLECTION, gameId);
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
  verb: ['chars', 'characters'],
  accept: [Format.V],
  async func({ context }) {
    const { playerInput } = context;
    const characters = await getGameCharacters(playerInput.messages.gameId);
    const gameCharacters = characters.items || [];


    let serverMessage = '';
    gameCharacters.map(({ name, class: charClass, race, level, ...rest }) => {
      const gameCharRace = getRaceFromType(race).name;
      const gameCharClass = getClassFromType(charClass).name;
      serverMessage += '<div style="border: 1px dashed white; padding: 15px;">';
      console.log({ name, ...rest });
      serverMessage += `<div>${name}</div>`;
      serverMessage += `<div>Level ${level} ${gameCharRace} ${gameCharClass}</div>`;
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
  verb: ['gm-give'],
  accept: [Format.VOPS, Format.VSDO],
  async func({ subject, object, context }) {
    const { playerInput: { messages: { gameId } } } = context;
    const character = await getCharacterByName(subject, gameId);
    if (!character) {
      context.response = getUniqueMessage({
        ...characters.GAME_MASTER,
        message: `Who is ${subject}?`
      });

      return CommandResult.HANDLED;
    }

    const item = await getItemByName(object);
    if (!item) {
      context.response = getUniqueMessage({
        ...characters.GAME_MASTER,
        message: `What is ${articleForNoun(object)} ${object}?`
      });

      return CommandResult.HANDLED;
    }

    const addResult = await addItemToInventory(character, item);
    const ratioString = `(${addResult.carryRatio.current}/${addResult.carryRatio.max})`;

    if (addResult.added) {
      context.response = getUniqueMessage({
        ...characters.GAME_MASTER,
        message: `Okay, ${subject} gets the ${object}. Their carry capacity is now ${ratioString}`
      });
    } else {
      context.response = getUniqueMessage({
        ...characters.GAME_MASTER,
        message: `${object} (${withUnits(item.weight, WEIGHT)}) is too heavy for ${subject} to carry ${ratioString}`
      });
    }

    return CommandResult.HANDLED;
  }
});

command({
  verb: ['gm-show'],
  accept: [Format.VOPS],
  async func({ subject, object, context }) {
    const { playerInput: { messages: { gameId } } } = context;
    const character = await getCharacterByName(subject, gameId);
    if (!character) {
      context.response = getUniqueMessage({
        ...characters.GAME_MASTER,
        message: `Who is ${subject}?`
      });

      return CommandResult.HANDLED;
    }

    if (object.toLowerCase() !== 'inventory') {
      context.response = getUniqueMessage({
        ...characters.GAME_MASTER,
        message: `Cannot show ${object} for ${subject}.`
      });

      return CommandResult.HANDLED;
    }

    const rawInventory = await getInventory(character);
    const inventory = rawInventory.reduce((counts, item) => {
      const currentCount = counts[item._id];
      if (!currentCount) {
        counts[item._id] = { ...item, count: 1 };
      } else {
        currentCount.count++;
        counts[item._id] = currentCount;
      }

      return counts;
    }, {});

    const ratio = await getCarryRatio(character);

    const table = `
      <table style="border: 1px dashed white; padding: 15px; text-align: left;">
        <tr>
          <th>Name</th>
          <th>Count</th>
          <th>Weight</th>
        </tr>
        ${
          Object.values(inventory).map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.count}</td>
            <td>${withUnits(item.weight, WEIGHT)}</td>
          </tr>
          `).join('')
        }
        <tr>
          <td colspan=2>Carry Capacity</td>
          <td>${ratio.current}/${ratio.max}</td>
        </tr>
      </table>
    `;

    context.response = getUniqueMessage({
      ...characters.GAME_MASTER,
      message: table
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
  addLog,
  deleteGame
};
