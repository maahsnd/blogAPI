const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment-controller');
const passport = require('passport');

router.post(
  '/new-comment',
  passport.authenticate('jwt', { session: false }),
  commentController.new_comment
);

router.get('/:id', commentController.get_comment);

router.post(
  '/:id/edit',
  passport.authenticate('jwt', { session: false }),
  commentController.edit_comment
);

router.post(
  '/:id/delete',
  passport.authenticate('jwt', { session: false }),
  commentController.delete_comment
);
module.exports = router;
