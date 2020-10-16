const express = require("express");
const views = require("./views");

const path = require("path");

const expressNunjucks = require("express-nunjucks");
const helmet = require("helmet");

const app = express();
const port = 3000;

const isDev = app.get("env") === "development";

const templatePath = path.resolve(__dirname + "/templates");
const staticPath = path.resolve(__dirname + "/static");

app.set("views", templatePath);
app.set("view engine", "njk");
const njk = expressNunjucks(app, {
    watch: isDev,
    noCache: isDev
});

app.use(helmet());

app.use("/", views);

app.use("/static", express.static(staticPath));

app.use((req, res, next) => {
    res.status(404).send("This page does not exist");
});

app.listen(port, () => {
    console.log("App started");
});