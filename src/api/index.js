const router = require('express').Router();

/**
 * @swagger
 * /api:
 *  get:
 *    name: root
 *    summary: API Root
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    responses:
 *      '200':
 *        description: Welcome to the Anorak API!
 */

router.get('/', (req, res) => {
  res.send({
    message: `Welcome to the Anorak API!`
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
