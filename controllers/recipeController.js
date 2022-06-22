const Recipe = require("../models/recipeModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

exports.getAllRecipes = factory.getAll(Recipe);
exports.getRecipe = factory.getOne(Recipe, { path: "comments" });

exports.createRecipe = factory.createOne(Recipe);
exports.updateRecipe = factory.updateOne(Recipe, {
  checkAuthor: true,
});

exports.deleteRecipe = factory.deleteOne(Recipe, {
  checkAuthor: true,
});
