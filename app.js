const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const recipeRouter = require("./routes/recipeRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// ПРОМЕЖУТОЧНОЕ ПО
// установить заголовки безопасности http
app.use(helmet());

// Логи запросов
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Ограничить запросы от одного IP
app.use(
  "/api",
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again later.",
  })
);

// Парсер тела запроса
app.use(express.json({ limit: "10kb" }));

// Стерилизация данных против инъекций NoSQL-запросов
app.use(mongoSanitize());

// Стерилизация данных против межсайтового скриптинга
app.use(xss());

// Предотвращение загрязнения параметрами
app.use(hpp());

// Статичные файлы
app.use(express.static(`${__dirname}/public`));

// МАРШРУТЫ
app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
