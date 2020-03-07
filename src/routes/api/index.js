const router = require('express').Router();
const version = process.env.API_VERSION || 0;

router.get('/', (req, res) => {
  res.send({
    message: `Welcome to the Perkins DM API v${version}!`
  });
});

module.exports = router;
