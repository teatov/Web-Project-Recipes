const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // const url = `${req.protocol}://${req.get("host")}/me`;
  // await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Проверка если пароль или почта существуют
  if (!email || !password) {
    return next(new AppError("Пожалуйста, введите почту и пароль!", 400));
  }
  // 2) Проверка если пользователь существиет и пароль корректен
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Неверная почта или пароль", 401));
  }

  // 3) Если всё ок, отправляем токен клиенту
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Получаем токен и проверяем, если он существует
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        "Вы не авторизированы! Пожалуйста, войдите в учётную запись.",
        401
      )
    );
  }

  // 2) Верифицируем токен
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Проверяем, если пользователь существует
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("Пользователь с этим токеном больше не существует.", 401)
    );
  }

  // 4) Проверяем, если пользователь сменил пароль после того как был выдан токен
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "Пароль пользователя был изменён! Выполните вход ещё раз.",
        401
      )
    );
  }

  // ВЫДАТЬ ДОСТУП К ЗАЩИЩЕННОМУ МАРШРУТУ
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// только для рендера
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Верифицируем токен
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Проверяем, если пользователь существует
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Проверяем, если пользователь сменил пароль после того как был выдан токен
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // ПОЛЬЗОВАТЕЛЬ АВТОРИЗИРОВАН
      res.locals.user = currentUser;
      req.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("У вас нет полномочий для этого действия", 403));
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Найти пользователя
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("Пользователя с такой почтой не существует.", 404)
    );
  }

  // 2) Сгенерировать рандомный токен сброса пароля
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Отправить его на почту пользователя
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Токен отправлен на почту!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("При отправке письма возникла ошибка"), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Находим пользователя
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) Если токен не истёк и пользователь существует, назначаем новый пароль
  if (!user) {
    return next(new AppError("Токен некорректен или его срок истёк", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) обновить changedPasswordAt у пользователя
  // 4) Авторизировать пользователя, отправить JWT
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Находим пользователя
  const user = await User.findById(req.user.id).select("+password");

  // 2) Проверяем если отправленный текущий пароль корректен
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Неверный текущий пароль.", 401));
  }

  // 3) Если да, то обновляем пароль
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Авторизировать пользователя, отправить JWT
  createSendToken(user, 200, req, res);
});

exports.setRecipeUserIds = (req, res, next) => {
  if (!req.body.recipe) req.body.recipe = req.params.recipeId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
