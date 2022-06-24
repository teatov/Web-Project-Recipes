const express = require("express");
const dishTypeController = require("../controllers/dishTypeController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.post("/:dishTypeId/:categoryId", dishTypeController.createSubcategory);

router.use(authController.restrictTo("admin"));

router.get("/categories/:category", dishTypeController.getTypeByCategory);
router.get("/subcategories/:subcategory", dishTypeController.getTypeByCategory);
router.post("/", dishTypeController.createDishType);
router.post("/:dishTypeId", dishTypeController.createCategory);

module.exports = router;
