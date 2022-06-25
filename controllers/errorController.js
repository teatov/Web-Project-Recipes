const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  let message;
  if (err.keyValue.email) {
    message = "Пользователь с такой почтой уже существует!";
  } else {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    message = `Поле со значением "${value}" уже существует. Используйте другое!`;
  }

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Введённые данные некорректны. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Неверный токен. Выполните вход ещё раз!", 401);

const handleJWTExpiredError = () =>
  new AppError(
    "Срок действия вашего токена истёк! Выполните вход ещё раз.",
    401
  );

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) РЕНДЕР
  console.error("ERROR", err);
  return res.status(err.statusCode).render("pages/error", {
    title: "Что-то пошло не так!",
    msg: err.message,
    statusCode: err.statusCode,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // A) операционная ошибка
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) программаня ошибка
    console.error("ERROR", err);
    return res.status(500).json({
      status: "error",
      message: "Что-то пошло не так!",
    });
  }

  // B) РЕНДЕР
  // A) операционная ошибка
  if (err.isOperational) {
    return res.status(err.statusCode).render("pages/error", {
      title: "Что-то пошло не так!",
      msg: err.message,
      statusCode: err.statusCode,
    });
  }
  // B) программаня ошибка
  console.error("ERROR", err);
  return res.status(err.statusCode).render("pages/error", {
    title: "Что-то пошло очень не так!",
    msg: "Пожалуйста, попробуйте позже.",
    statusCode: err.statusCode,
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
