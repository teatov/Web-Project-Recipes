const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.ObjectId,
    ref: "Recipe",
    required: [true, "Bookmark must belong to a Recipe!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Bookmark must belong to a User!"],
  },
});

bookmarkSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "recipe",
    select: "name description slug",
  });
  next();
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;
