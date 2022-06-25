const express = require("express");
const bookmarkController = require("../controllers/bookmarkController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.post(
  "/",
  authController.setRecipeUserIds,
  bookmarkController.createBookmark
);

router.delete("/:id", bookmarkController.deleteBookmark);

router.use(authController.restrictTo("admin"));

router.route("/").get(bookmarkController.getAllBookmarks);

router
  .route("/:id")
  .get(bookmarkController.getBookmark)
  .patch(bookmarkController.updateBookmark)
  .delete(bookmarkController.deleteBookmark);

module.exports = router;
