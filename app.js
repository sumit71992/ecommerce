const express = require('express');
const path = require("path");
const router = express.Router();
const mainRoutes = require("./backend/routes/MainRoutes");
const app = express();
const session = require("express-session");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const bodyparser = require("body-parser");
const logger = require("morgan");

app.use(cors());
app.use(compression());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieparser());
app.set("views", __dirname + "/client/views");
app.engine("html", require("ejs").renderFile);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "client/assets")));
app.use(express.static(path.join(__dirname, "client/assets/css")));
app.use(express.static(path.join(__dirname, "client/assets/script")));
app.use(express.static(path.join(__dirname, "client/assets/images")));

app.use(logger("dev"));
app.use(
    session({
        secret: "SumitKumarProject",
        resave: false,
        saveUninitialized: false,
        cookie: {
            path: "/",
            httpOnly: true,
            secure: false,
            maxAge: null,
        },
    })
);

app.use("/", mainRoutes);
app.set("port", process.env.PORT || 4000);
app.listen(app.get("port"), () => {
    console.log("Application running in port:" + app.get("port"));
})
module.exports = app;