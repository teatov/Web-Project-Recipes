const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const Recipe = require("../models/recipeModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const cloudinary = require("../utils/cloudinary");
const factory = require("./handlerFactory");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Пожалуйста, загружайте только изображения.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadRecipeImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "stepImage", maxCount: 20 },
]);

exports.processRecipeImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  if (req.files.imageCover) {
    const filename = `recipe-${req.body.idRecipe}-${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333, { withoutEnlargement: true })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/recipes/${filename}`);

    const result = await cloudinary.uploader.upload(
      `public/img/recipes/${filename}`
    );
    req.body.image = result.secure_url;
    fs.unlink(
      path.join(__dirname, `../public/img/recipes/${filename}`),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  if (req.files.stepImage) {
    req.body.steps = [];
    await Promise.all(
      req.body.stepNumbers.map(async (n, i) => {
        if (Number(n) === i && n) {
          const filename = `recipe-${
            req.body.idRecipe
          }-${Date.now()}-${i}.jpeg`;
          await sharp(req.files.stepImage[i].buffer)
            .resize(2000, 1333, { withoutEnlargement: true })
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/img/recipes/${filename}`);

          const result = await cloudinary.uploader.upload(
            `public/img/recipes/${filename}`
          );

          req.body.steps.push({
            image: result.secure_url,
            number: Number(n) + 1,
            text: req.body.stepTexts[i],
          });
          fs.unlink(
            path.join(__dirname, `../public/img/recipes/${filename}`),
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        } else {
          req.files.stepImage.splice(i, 0, "");
          req.body.steps.push({
            number: i + 1,
            text: req.body.stepTexts[i],
          });
        }
      })
    );
  }

  next();
});

exports.getAllRecipes = factory.getAll(Recipe);
exports.getRecipe = factory.getOne(Recipe, { path: "comments" });

exports.createRecipe = factory.createOne(Recipe);
exports.updateRecipe = factory.updateOne(Recipe, {
  restrictFields: ["slug", "createdAt", "user"],
});

exports.deleteRecipe = factory.deleteOne(Recipe);

exports.restrictToAuthor = factory.restrictToAuthor(Recipe);
