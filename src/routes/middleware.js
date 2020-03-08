const auth = require('../utils/auth.js');
const playerData = require('../data/players.js');
const status = require('../constants/statusMessages');

const authPlayerMiddleware = async (req, res, next) => {
  const token = auth.getTokenFromHeaders(req);
  if (!token) {
    return status.requiresAuth(res);
  }

  const decodedToken = auth.decodeJWT(token);
  req.player = await playerData.getPlayerByEmail(decodedToken.email);
  next();
}

module.exports = {
  authPlayerMiddleware,
}
