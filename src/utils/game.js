const { AUTH_USER, GAME_MASTER } = require('../constants/game');
const log = require('../utils/log');

const parseUserInput = (userInput, config = {}) => {
  log.cool('Parsing User Input: %s %o', userInput, config);
  if (userInput === 'login' || userInput === 'signin') {
    return {
      character: AUTH_USER,
      message: config.isAuthenticated ? 'Already signed in :D' : 'Signing In...',
      color: 'orange'
    };
  } else if (userInput === 'logout' || userInput === 'signout') {
    return {
      character: AUTH_USER,
      message: config.isAuthenticated ? 'Signing Out...' : 'Not signed in',
      color: 'orange'
    };
  } else if (userInput === 'newgame') {
    if (config.isAuthenticated) {
      return {
        character: GAME_MASTER,
        message: 'Starting a new game...',
        color: '#7383BF'
      };
    } else {
      return {
        character: AUTH_USER,
        message: 'Please sign in first',
        color: 'orange'
      };
    }
  }

  return {};
};

module.exports = {
  parseUserInput
};
