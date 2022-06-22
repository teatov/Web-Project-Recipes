const Comment = require("../models/commentsModel");
const factory = require("./handlerFactory");

exports.setRecipeUserIds = (req, res, next) => {
  if (!req.body.recipe) req.body.recipe = req.params.recipeId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);

exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);

exports.deleteComment = factory.deleteOne(Comment);
