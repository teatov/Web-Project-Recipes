const Comment = require("../models/commentsModel");
const factory = require("./handlerFactory");

exports.setRecipeUserIds = (req, res, next) => {
  if (!req.body.recipe) req.body.recipe = req.params.recipeId;
  if (!req.body.user) req.body.user = req.user.id;
  console.log(req.body, req.params.recipeId);
  next();
};

exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);

exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment, {
  checkAuthor: true,
  restrictFields: ["recipe", "createdAt", "user"],
});

exports.deleteComment = factory.deleteOne(Comment, {
  checkAuthor: true,
});
