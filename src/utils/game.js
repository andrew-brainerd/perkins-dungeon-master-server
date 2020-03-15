const { AUTH_USER, GAME_MASTER } = require('../constants/game');
const { v1: uuidv1 } = require('uuid');
const log = require('../utils/log');

const getUniqueMessage = message => ({
  messages: {
    id: uuidv1(),
    ...message
  }
});

const parseUserInput = userInput => {
  const { messages: { message } } = userInput || {};
  log.cool('Parsing User Input: %o', userInput);
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
  }

  return getUniqueMessage({
    ...GAME_MASTER,
    message: 'Unrecognized user input'
  });
};

module.exports = {
  parseUserInput
};
