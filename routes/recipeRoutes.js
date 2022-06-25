const express = require("express");
const recipeController = require("../controllers/recipeController");
const authController = require("../controllers/authController");
const commentRouter = require("./commentRoutes");

const router = express.Router();

router.use("/:recipeId/comments", commentRouter);

router.get("/", recipeController.getAllRecipes);
router.get("/:id", recipeController.getRecipe);

router.use(authController.protect);

router.post(
  "/",
  authController.setRecipeUserIds,
  recipeController.createRecipe
);

router.use(recipeController.restrictToAuthor);

router
  .route("/")
  .patch(recipeController.updateRecipe)
  .delete(recipeController.deleteRecipe);

router
  .route("/:id")
  .patch(
    recipeController.uploadRecipeImages,
    recipeController.processRecipeImages,
    recipeController.updateRecipe
  )
  .delete(recipeController.deleteRecipe);

module.exports = router;
