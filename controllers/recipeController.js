const Recipe = require("../models/recipeModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllRecipes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Recipe.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const recipes = await features.query;

  res.status(200).json({
    status: "success",
    results: recipes.length,
    data: {
      recipes,
    },
  });
});

exports.getRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(new AppError("No recipe found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      recipe,
    },
  });
});

exports.createRecipe = catchAsync(async (req, res, next) => {
  const newRecipe = await Recipe.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      recipe: newRecipe,
    },
  });
});

exports.updateRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!recipe) {
    return next(new AppError("No recipe found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      recipe,
    },
  });
});

exports.deleteRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);

  if (!recipe) {
    return next(new AppError("No recipe found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
