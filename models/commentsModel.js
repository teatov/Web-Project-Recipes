const mongoose = require("mongoose");
const Recipe = require("./recipeModel");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Comment can not be empty!"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    recipe: {
      type: mongoose.Schema.ObjectId,
      ref: "Recipe",
      required: [true, "Comment must belong to a recipe"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Comment must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.index({ recipe: 1, user: 1 }, { unique: true });

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
