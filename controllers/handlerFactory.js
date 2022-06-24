const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const Recipe = require("../models/recipeModel");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc;
    console.log(req.body);
    if (req.body.slug) {
      doc = await Model.findOneAndDelete({ slug: req.body.slug });
    } else {
      doc = await Model.findByIdAndDelete(req.params.id);
    }

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model, options) =>
  catchAsync(async (req, res, next) => {
    if (options.restrictFields && req.user.role !== "admin") {
      options.restrictFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
          return next(
            new AppError("You are not permitted to update those fields", 400)
          );
        }
      });
    }

    let doc;
    if (req.body.slug) {
      console.log("111fgdfg", req.body.slug);
      doc = await Model.findOneAndUpdate({ slug: req.body.slug }, req.body, {
        new: true,
        runValidators: true,
      });
    } else {
      doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.body.slug) {
      const recipe = await Recipe.findOne({ slug: req.body.slug });
      req.body.recipe = String(recipe._id);
    }
    console.log(req.body);
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query;
    if (req.body.slug) {
      query = Model.findOne({ slug: req.body.slug });
    } else {
      query = Model.findById(req.params.id);
    }

    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.recipeId) filter = { recipe: req.params.recipeId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

exports.restrictToAuthor = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc;
    console.log("11111111", Model, req.body, req.params);
    if (req.params.slug) {
      doc = await Model.findOne({ slug: req.params.slug });
    } else {
      doc = await Model.findById(req.params.id);
    }
    console.log(doc);

    if (
      doc &&
      req.user.role !== "admin" &&
      req.user.id !== String(doc.user._id)
    ) {
      return next(new AppError("Only author can perform this!", 403));
    }
    next();
  });
