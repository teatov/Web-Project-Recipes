const mongoose = require("mongoose");
const slugify = require("slugify");

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "У рецепта должно быть имя"],
      unique: true,
      trim: true,
      maxlength: [50, "Название рецепта слишком длинное"],
      minlength: [2, "Название рецепта слишком короткое"],
    },
    dishType: {
      type: String,
      required: [true, "У рецепта должен быть тип"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "У рецепта должна быть категория"],
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "У рецепта должно быть описание"],
      trim: true,
    },
    properties: [
      {
        type: {
          type: String,
          trim: true,
          enum: ["time", "servings", "difficulty"],
          required: true,
        },
        value: {
          type: String,
          trim: true,
          required: true,
        },
      },
    ],
    ingredients: {
      type: [
        {
          name: {
            type: String,
            trim: true,
            required: true,
          },
          amount: {
            type: String,
            trim: true,
            required: true,
          },
        },
      ],
      validate: [
        (val) => val.length >= 1 && val[0],
        "У рецепта должен быть хотя бы один ингредиент",
      ],
    },
    steps: {
      type: [
        {
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
        },
      ],
      validate: [
        (val) => val.length >= 1 && val[0],
        "У рецепта должен быть хотя бы один шаг",
      ],
    },
    tags: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
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
  this.slug = slugify(this.name, { lower: true });
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
