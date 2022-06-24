const mongoose = require("mongoose");

const dishTypeSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    categories: [
      {
        name: { type: String, trim: true, required: true },
        subcategories: [
          {
            name: { type: String, trim: true, required: true },
          },
        ],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const DishType = mongoose.model("DishType", dishTypeSchema);

module.exports = DishType;
