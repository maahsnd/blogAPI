const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');

/* GET home page. */
router.get('/', postController.all_blogposts_get);

/* GET individual post */
router.get('/:id', postController.blogpost_get);

/* GET new blogpost */
router.get('/new-post', postController.new_blogpost_get);

/* POST new blogpost */
router.post('/new-post', postController.new_blogpost_post);

module.exports = router;
