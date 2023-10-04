const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authentication-controller');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a sign up/log in page, or with log out');
});

router.get('/sign-up', authenticationController.sign_up_get);

router.post('/sign-up', authenticationController.sign_up_post);

router.get('/log-in', authenticationController.log_in_get);

router.post('/log-in', authenticationController.log_in_post);

router.post('/log-out', authenticationController.logout_post);

module.exports = router;
