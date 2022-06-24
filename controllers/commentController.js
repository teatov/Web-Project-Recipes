const Comment = require("../models/commentsModel");
const factory = require("./handlerFactory");

exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);

exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment, {
  restrictFields: ["recipe", "createdAt", "user"],
});

exports.deleteComment = factory.deleteOne(Comment);

exports.restrictToAuthor = factory.restrictToAuthor(Comment);
