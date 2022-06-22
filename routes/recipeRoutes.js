const express = require("express");
const recipeController = require("../controllers/recipeController");
const authController = require("../controllers/authController");
const commentRouter = require("./commentRoutes");

const router = express.Router();

router.use("/:recipeId/comments", commentRouter);

router
  .route("/")
  .get(authController.protect, recipeController.getAllRecipes)
  .post(
    authController.protect,
    authController.restrictTo("user", "admin"),
    recipeController.createRecipe
  );

router
  .route("/:id")
  .get(recipeController.getRecipe)
  .patch(
    authController.protect,
    authController.restrictTo("user", "admin"),
    recipeController.updateRecipe
  )
  .delete(
    authController.protect,
    authController.restrictTo("user", "admin"),
    recipeController.deleteRecipe
  );

module.exports = router;
