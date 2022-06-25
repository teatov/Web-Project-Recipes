const express = require("express");
const dishTypeController = require("../controllers/dishTypeController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.route("/").post(dishTypeController.createDishType);
router
  .route("/:dishTypeId")
  .post(dishTypeController.createCategory)
  .delete(dishTypeController.deleteDishType);
router
  .route("/:dishTypeId/:categoryId")
  .post(dishTypeController.createSubcategory)
  .delete(dishTypeController.deleteCategory);
router
  .route("/:dishTypeId/:categoryId/:subcategoryId")
  .delete(dishTypeController.deleteSubcategory);

router.get("/categories/:category", dishTypeController.getTypeByCategory);
router.get("/subcategories/:subcategory", dishTypeController.getTypeByCategory);

module.exports = router;
