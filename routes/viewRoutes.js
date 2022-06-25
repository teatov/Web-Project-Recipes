const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", viewController.getMain);
router.get("/recipes/", viewController.getOverview);
router.get("/recipes/:slug", viewController.getRecipe);

router.get("/login", viewController.getLoginForm);
router.get("/signup", viewController.getSignupForm);

router.get(
  "/me",
  authController.protect,
  authController.isLoggedIn,
  viewController.getAccount
);
router.get(
  "/createRecipe",
  authController.protect,
  viewController.getRecipeForm
);

router.get(
  "/recipes/:slug/edit",
  authController.protect,
  viewController.restrictToAuthor,
  viewController.getRecipeEditForm
);

router.post(
  "/submit-user-data",
  authController.protect,
  viewController.updateUserData
);

router.get(
  "/administration",
  authController.protect,
  authController.restrictTo("admin"),
  viewController.getAdminPage
);

module.exports = router;
