const {
  SUCCESS,
  CREATED,
  BAD_REQUEST,
  AUTH_ERROR,
  DOES_NOT_EXIST,
  CONFLICT,
  SERVER_ERROR
} = require('./responseCodes');

const success = (res, body) => res.status(SUCCESS).send(body);

const created = (res, body) => res.status(CREATED).send(body);

const missingQueryParam = (res, param) =>
  res.status(BAD_REQUEST).send({ message: `Missing query param: [${param}]` });

const missingBodyParam = (res, param) =>
  res.status(BAD_REQUEST).send({ message: `Missing body param: [${param}]` });

const doesNotExist = (res, type, property, container) =>
  res.status(DOES_NOT_EXIST).send({
    message: `${type} [${property}] does not exist${container ? ` in ${container}` : ''}`
  });

const authError = (res, email) =>
  res.status(AUTH_ERROR).send({
    message: `Bad credentials or player with email [${email}] does not exist.`
  });

const alreadyExists = (res, type, property, value, container) =>
  res.status(CONFLICT).send({
    message: `${type} with ${property} [${value}] already exists${container ? ` in ${container}` : ''}`
  });

const serverError = (res, error, message) => res.status(SERVER_ERROR).send({ message, error });

module.exports = {
  authError,
  success,
  created,
  missingQueryParam,
  missingBodyParam,
  doesNotExist,
  alreadyExists,
  serverError
};
