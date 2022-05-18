const express = require("express");
const morgan = require("morgan");

// const postsApiRouter = require("./routes/postsApiRoutes");
const viewRoutes = require("./routes/viewRoutes");

const app = express();
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
// app.use("/api/posts", postsApiRouter);
app.use("/", viewRoutes);

module.exports = app;
