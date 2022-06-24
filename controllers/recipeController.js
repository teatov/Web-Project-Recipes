const Recipe = require("../models/recipeModel");
const factory = require("./handlerFactory");

exports.getAllRecipes = factory.getAll(Recipe);
exports.getRecipe = factory.getOne(Recipe, { path: "comments" });

exports.createRecipe = factory.createOne(Recipe);
exports.updateRecipe = factory.updateOne(Recipe, {
  restrictFields: ["likes", "dislikes", "slug", "createdAt", "user"],
});

exports.deleteRecipe = factory.deleteOne(Recipe);

exports.restrictToAuthor = factory.restrictToAuthor(Recipe);
