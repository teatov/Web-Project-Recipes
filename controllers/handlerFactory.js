const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model, options) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    if (
      options.checkAuthor &&
      req.user.role !== "admin" &&
      req.user.id !== String(doc.user._id)
    ) {
      return next(new AppError("Only author can delete this", 403));
    }

    await doc.deleteOne();

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model, options) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    if (
      options.checkAuthor &&
      req.user.role !== "admin" &&
      req.user.id !== String(doc.user._id)
    ) {
      return next(new AppError("Only author can update this!", 403));
    }

    if (options.restrictFields && req.user.role !== "admin") {
      options.restrictFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
          return next(new AppError("You can't update those fields!", 400));
        }
      });
    }

    const docUpdated = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      returnDocument: "after",
    });

    res.status(200).json({
      status: "success",
      data: {
        data: docUpdated,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
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
    let query = Model.findById(req.params.id);
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
    if (req.params.recipeId) filter = { tour: req.params.recipeId };

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
