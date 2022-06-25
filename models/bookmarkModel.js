const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.ObjectId,
    ref: "Recipe",
    required: [true, "Закладка должна принадлежать рецепту!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Закладка должна принадлежать пользователю!"],
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
