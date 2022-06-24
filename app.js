const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const recipeRouter = require("./routes/recipeRoutes");
const userRouter = require("./routes/userRoutes");
const commentRouter = require("./routes/commentRoutes");
const dishTypeRouter = require("./routes/dishTypeRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ПРОМЕЖУТОЧНОЕ ПО
// статичные файлы
app.use(express.static(path.join(__dirname, "public")));

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
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Стерилизация данных против инъекций NoSQL-запросов
app.use(mongoSanitize());

// Стерилизация данных против межсайтового скриптинга
app.use(xss());

// Предотвращение загрязнения параметрами
app.use(hpp());

// МАРШРУТЫ
app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/dishTypes", dishTypeRouter);
app.use("/", viewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
