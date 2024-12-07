const express = require("express");
require("dotenv").config();
const path = require("path");
const templateEngine = require("./22413");

const app = express();
const PORT = process.env.PORT || 3000;

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

app.get("/", (req, res) => {
  res.render("home/home");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
