const express = require("express");
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(commentController.getAllComments)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    commentController.setRecipeUserIds,
    commentController.createComment
  );

router
  .route("/:id")
  .get(commentController.getComment)
  .patch(
    authController.protect,
    authController.restrictTo("user", "admin"),
    commentController.updateComment
  )
  .delete(
    authController.protect,
    authController.restrictTo("user", "admin"),
    commentController.deleteComment
  );

module.exports = router;
