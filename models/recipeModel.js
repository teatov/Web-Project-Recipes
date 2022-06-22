const mongoose = require("mongoose");
const slugify = require("slugify");

const propertySchema = new mongoose.Schema({
  type: {
    type: String,
    trim: true,
  },
  value: {
    type: String,
    trim: true,
  },
});

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  amount: {
    type: String,
    trim: true,
  },
});

const stepSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    trim: true,
  },
  text: {
    type: String,
    trim: true,
    required: true,
  },
});

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A recipe must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        50,
        "A recipe name must have less or equal then 50 characters",
      ],
      minlength: [2, "A recipe name must have more or equal then 2 characters"],
    },
    category: {
      type: String,
      required: [true, "A recipe must have a category"],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A recipe must have a description"],
      trim: true,
    },
    properties: [propertySchema],
    ingredients: [ingredientSchema],
    steps: [stepSchema],
    tags: [{ type: String, trim: true }],
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

recipeSchema.index({ slug: 1 });

recipeSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "recipe",
  localField: "_id",
});

recipeSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

recipeSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
