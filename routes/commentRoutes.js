const express = require("express");
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(commentController.getAllComments)
  .post(authController.setRecipeUserIds, commentController.createComment);

router.get("/:id", commentController.getComment);

router.use(commentController.restrictToAuthor);

router
  .route("/:id")
  .patch(commentController.restrictToAuthor, commentController.updateComment)
  .delete(commentController.restrictToAuthor, commentController.deleteComment);

module.exports = router;
