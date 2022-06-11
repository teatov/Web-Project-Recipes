const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("../models/recipeModel");

dotenv.config({ path: "./config.env" });

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  console.log("DB connection successful");
});

const recipes = JSON.parse(
  fs.readFileSync(`${__dirname}/recipes.json`, "utf-8")
);

const importData = async () => {
  try {
    await Recipe.create(recipes);
    console.log("yesss");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Recipe.deleteMany();
    console.log("deleteddd");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

if (process.argv[2] === "--import") {
  importData();
}

if (process.argv[2] === "--delete") {
  deleteData();
}
