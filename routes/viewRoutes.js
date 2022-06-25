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

router.use(authController.protect);

router.get("/me", authController.protect, viewController.getAccount);
router.get("/createRecipe", viewController.getRecipeForm);

router.get(
  "/recipes/:slug/edit",
  viewController.restrictToAuthor,
  viewController.getRecipeEditForm
);

router.post("/submit-user-data", viewController.updateUserData);

router.get(
  "/administration",
  authController.restrictTo("admin"),
  viewController.getAdminPage
);

module.exports = router;
