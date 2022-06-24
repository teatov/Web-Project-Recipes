const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");
const DishType = require("../models/dishTypeModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const factory = require("./handlerFactory");

exports.getOverview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.recipeId) filter = { recipe: req.params.recipeId };

  const features = new APIFeatures(Recipe.find(filter), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();
  const recipes = await features.query;
  const dishTypes = await DishType.find();
  console.log(dishTypes);
  res.status(200).render("pages/overview", {
    recipes,
    dishTypes,
    query: req.query,
  });
});

exports.getRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findOne({ slug: req.params.slug }).populate({
    path: "comments",
    fields: "text user createdAt",
  });

  if (!recipe) {
    return next(new AppError("There is no recipe with that name.", 404));
  }

  const features = new APIFeatures(
    Recipe.find({ slug: { $ne: req.params.slug } }),
    {
      limit: 3,
      fields: "name,image,description,properties,likes,dislikes,slug",
      search: recipe.name.replaceAll(" ", "+"),
    }
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();
  const similarRecipes = await features.query;

  res.status(200).render("pages/recipe", {
    recipe,
    similarRecipes,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("pages/login");
};

exports.getSignupForm = (req, res) => {
  res.status(200).render("pages/signup");
};

exports.getAccount = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Recipe.find({ user: { _id: req.user.id } }),
    {
      fields: "name,image,description,createdAt,slug",
    }
  )
    .filter()
    .sort()
    .limitFields();

  const userRecipes = await features.query;
  res.status(200).render("pages/account", { userRecipes });
});

exports.getRecipeForm = catchAsync(async (req, res, next) => {
  const dishTypes = await DishType.find();
  console.log(dishTypes);
  res.status(200).render("pages/createRecipe", { recipe: null, dishTypes });
});

exports.getRecipeEditForm = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findOne({ slug: req.params.slug });

  if (!recipe) {
    return next(new AppError("There is no recipe with that name.", 404));
  }

  const dishTypes = await DishType.find();
  console.log(dishTypes);
  res.status(200).render("pages/createRecipe", { recipe, dishTypes });
});

exports.getMain = catchAsync(async (req, res, next) => {
  const featuresSnacks = new APIFeatures(
    Recipe.find({ slug: { $ne: req.params.slug } }),
    {
      limit: 3,
      fields: "name,image,description,properties,likes,dislikes,slug",
      dishType: "Закуски",
    }
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();
  const recipesSnacks = await featuresSnacks.query;
  const featuresHot = new APIFeatures(
    Recipe.find({ slug: { $ne: req.params.slug } }),
    {
      limit: 3,
      fields: "name,image,description,properties,likes,dislikes,slug",
      dishType: "Горячие блюда",
    }
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();
  const recipesHot = await featuresHot.query;
  const featuresCold = new APIFeatures(
    Recipe.find({ slug: { $ne: req.params.slug } }),
    {
      limit: 3,
      fields: "name,image,description,properties,likes,dislikes,slug",
      dishType: "Холодные блюда",
    }
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();
  const recipesCold = await featuresCold.query;
  const featuresDough = new APIFeatures(
    Recipe.find({ slug: { $ne: req.params.slug } }),
    {
      limit: 3,
      fields: "name,image,description,properties,likes,dislikes,slug",
      dishType: "Изделия из теста",
    }
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();
  const recipesDough = await featuresDough.query;
  const featuresSweats = new APIFeatures(
    Recipe.find({ slug: { $ne: req.params.slug } }),
    {
      limit: 3,
      fields: "name,image,description,properties,likes,dislikes,slug",
      dishType: "Сладости",
    }
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();
  const recipesSweats = await featuresSweats.query;
  console.log(
    recipesSnacks,
    recipesCold,
    recipesHot,
    recipesDough,
    recipesSweats
  );

  res.status(200).render("pages/main", {
    recipesSnacks,
    recipesCold,
    recipesHot,
    recipesDough,
    recipesSweats,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render("pages/account", {
    user: updatedUser,
  });
});

exports.restrictToAuthor = factory.restrictToAuthor(Recipe);
