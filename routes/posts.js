const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');
const passport = require('passport');

/* GET home page. */
router.get('/', postController.all_blogposts_get);

/* GET new blogpost */
router.get(
  '/new-post',
  passport.authenticate('jwt', { session: false }),
  postController.new_blogpost_get
);
/* POST new blogpost */
router.post(
  '/new-post',
  passport.authenticate('jwt', { session: false }),
  postController.new_blogpost_post
);

/* GET edit blogpost */
router.get(
  '/:id/edit',
  passport.authenticate('jwt', { session: false }),
  postController.blogpost_edit_get
);

/* POST edit blogpost */
router.post(
  '/:id/edit',
  passport.authenticate('jwt', { session: false }),
  postController.blogpost_edit_post
);

/* GET individual post */
router.get('/:id', postController.blogpost_get);

router.post(
  '/:id/new-comment',
  passport.authenticate('jwt', { session: false }),
  postController.new_comment
);

module.exports = router;
