const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');

/* GET home page. */
router.get('/', postController.all_posts_get);

module.exports = router;
