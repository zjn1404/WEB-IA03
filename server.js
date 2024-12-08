const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const templateEngine = require("./22413");
const movieRouter = require("./routers/movie.r");
const actorRouter = require("./routers/actor.r");
const directorRouter = require("./routers/director.r");
const errorCode = require("./error/errorCode");
const ApplicationError = require("./error/cerror");
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const ec = errorCode.ErrorCode;

app.engine(
  "22413",
  templateEngine.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, ".", "views", "layouts"),
    partialsDir: path.join(__dirname, ".", "views", "partials"),
    extname: ".22413",
    encoding: "utf8",
    helpers: {},
  })
);
app.set("view engine", "22413");
app.set("views", path.join(__dirname, ".", "views"));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.render("home/home");
});

app.use("/", movieRouter, actorRouter, directorRouter);

app.use((req, res, next) => {
  res.status(ec.PAGE_NOT_FOUND.statusCode).render("./partials/error", {
    error: new ApplicationError(ec.PAGE_NOT_FOUND),
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode
    ? err.statusCode
    : ec.SERVER_ERROR.statusCode;
  res.status(statusCode).render("./partials/error", {
    error:
      statusCode === ec.SERVER_ERROR.statusCode
        ? new ApplicationError(ec.SERVER_ERROR)
        : new ApplicationError(err),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
