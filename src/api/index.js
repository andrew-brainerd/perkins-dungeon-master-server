const router = require('express').Router();
const appInfo = require('../../package.json');

router.get('/', (req, res) => {
  res.send({
    message: `Welcome to the Anorak API v${appInfo.version}!`
  });
});

router.get('/humor/quote', (req, res) => {
  res.send({
    message: 'You are a part of the rebel alliance, and a traitor! Take her away!',
  });
});

router.use('/games', require('./games'));
router.use('/characters', require('./characters'));
router.use('/players', require('./players'));

module.exports = router;
