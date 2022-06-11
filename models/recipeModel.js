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

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Comment must belong to a user"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
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
    tags: [{ type: String, trim: true, unique: true }],
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    // comments: [commentSchema],
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

recipeSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
