const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Пожалуйста, введите имя"],
      maxlength: [50, "Имя слишком длинное"],
    },
    email: {
      type: String,
      required: [true, "Пожалуйста, введите почту"],
      unique: [true, "Пользователь с такой почтой уже существует"],
      lowercase: true,
      validate: [validator.isEmail, "Некорректная почта"],
      maxlength: [50, "Почта слишком длинная"],
    },
    photo: {
      type: String,
      default: "defaultpic.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Пожалуйста, введите пароль"],
      minlength: [6, "Пароль должен состоять минимум из 6 символов"],
      select: false,
      maxlength: [50, "Пароль слишком длинный"],
    },
    passwordConfirm: {
      type: String,
      required: [true, "Пожалуйста, подтвердите пароль"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Пароль не подтверждён",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  // Выполняется только если пароль поменялся
  if (!this.isModified("password")) return next();

  // Хэширование пароля
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
