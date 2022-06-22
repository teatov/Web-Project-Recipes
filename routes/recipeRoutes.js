const express = require("express");
const recipeController = require("../controllers/recipeController");
const authController = require("../controllers/authController");
const commentRouter = require("./commentRoutes");

const router = express.Router();

router.use("/:recipeId/comments", commentRouter);

router
  .route("/")
  .get(recipeController.getAllRecipes)
  .post(authController.protect, recipeController.createRecipe);

router
  .route("/:id")
  .get(recipeController.getRecipe)
  .patch(
    authController.protect,
    authController.restrictToAuthor,
    recipeController.updateRecipe
  )
  .delete(
    authController.protect,
    authController.restrictToAuthor,
    recipeController.deleteRecipe
  );

module.exports = router;
