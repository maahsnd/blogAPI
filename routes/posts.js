const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');
const verifyToken = require('../verifyToken').verifyToken;

/* GET home page. */
router.get('/', postController.all_blogposts_get);

/* GET new blogpost */
router.get('/new-post', verifyToken, postController.new_blogpost_get);

/* POST new blogpost */
router.post('/new-post', postController.new_blogpost_post);

/* GET edit blogpost */
router.get('/edit-post', postController.blogpost_edit_get);

/* POST edit blogpost */
router.post('/edit-post', postController.blogpost_edit_post);

/* GET individual post */
router.get('/:id', postController.blogpost_get);

module.exports = router;
