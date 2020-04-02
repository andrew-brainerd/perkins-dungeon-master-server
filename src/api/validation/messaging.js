const Joi = require('joi');

const postMessageBody = Joi.object({
  gameId: Joi.string(),
  to: Joi.string().required(),
  from: Joi.string().required(),
  subject: Joi.string().required(),
  text: Joi.string(),
  html: Joi.string()
});

module.exports = {
  postMessageBody
};
