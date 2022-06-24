const DishType = require("../models/dishTypeModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createDishType = catchAsync(async (req, res, next) => {
  //   const doc = await Recipe.findOne({ slug: req.body.slug });

  const doc = await DishType.create(req.body);

  //   if (!doc) {
  //     return next(new AppError("No document found with that ID", 404));
  //   }

  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const doc = await DishType.findById(req.params.dishTypeId);

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  await doc.categories.push(req.body);
  await doc.save();

  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.createSubcategory = catchAsync(async (req, res, next) => {
  const doc = await DishType.findById(req.params.dishTypeId);

  if (!doc) {
    return next(new AppError("No type found with that ID", 404));
  }

  const docCat = await doc.categories.find(
    (el) => String(el._id) === req.params.categoryId
  );

  if (!docCat) {
    return next(new AppError("No category found with that ID", 404));
  }

  await docCat.subcategories.push(req.body);
  await doc.save();

  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.getTypeByCategory = catchAsync(async (req, res, next) => {
  let doc;
  if (req.params.category) {
    doc = await DishType.findOne({
      "categories.name": req.params.category,
    });
  } else {
    doc = await DishType.findOne({
      "categories.subcategories.name": req.params.subcategory,
    });
  }

  if (!doc) {
    return next(new AppError("No type found with that category", 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
