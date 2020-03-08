const jwt = require('express-jwt');
const crypto = require('crypto');
const webtoken = require('jsonwebtoken');

const derivePasswordBasedKey = (password, salt) => crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');

const encryptPassword = password => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = derivePasswordBasedKey(password, salt);
  return { hash, salt };
}

const validateLogin = (player, password) => {
  const { hash, salt } = player;
  const passWordHash = derivePasswordBasedKey(password, salt);
  return hash === passWordHash;
}

const generateJWT = player => {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return webtoken.sign({
    id: player._id,
    email: player.email,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

const toAuthJSON = player => {
  return {
    _id: player._id,
    email: player.email,
    token: generateJWT(player)
  };
}

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;

  if (authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

const authConfig = {
  required: jwt({
    secret: 'secret',
    playerProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: 'secret',
    playerProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
}

const authOpts = { session: false };

module.exports = {
  authOpts,
  authConfig,
  encryptPassword,
  generateJWT,
  toAuthJSON,
  validateLogin,
}
