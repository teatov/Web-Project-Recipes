const mongoose = require("mongoose");

const dishTypeSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: [true, "Нет имени"] },
    categories: [
      {
        name: { type: String, trim: true, required: [true, "Нет имени"] },
        subcategories: [
          {
            name: { type: String, trim: true, required: [true, "Нет имени"] },
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
