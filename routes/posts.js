const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');

/* GET home page. */
router.get('/', postController.all_blogposts_get);

/* GET individual post */
router.get('/', postController.blogpost_get);

module.exports = router;
