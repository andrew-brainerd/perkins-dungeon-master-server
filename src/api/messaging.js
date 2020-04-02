const messaging = require('express').Router();
const emailClient = require('@sendgrid/mail');
const log = require('../utils/log');
const status = require('../utils/statusMessages');
const { validator } = require('../utils/validator');
const { postMessageBody } = require('./validation/messaging');

messaging.post('/', validator.body(postMessageBody), async (req, res) => {
  const { body: { to, from, subject, text, html } } = req;

  emailClient.setApiKey(process.env.SENDGRID_API_KEY);
  emailClient.send({ to, from, subject, text, html });

  log.cool(`Sent email with subject [${subject}] to ${to}`);

  return status.created(res, { to, from, subject, text, html });
});

module.exports = messaging;
