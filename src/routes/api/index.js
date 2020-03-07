const router = require('express').Router();
const version = process.env.API_VERSION || 0;

router.get('/', (req, res) => {
  res.send({
    message: `Welcome to the Perkins DM API v${version}!`
  });
});

router.get('/humor/quote', (req, res) => {
  res.send({
    message: 'You are a part of the rebel alliance, and a traitor! Take her away!',
  });
});

module.exports = router;
