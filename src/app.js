const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");

const app = express();

// enable cors
app.use(cors());
app.options("*", cors());
if (config.env !== "test") {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

app.set("trust proxy", true);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// Allow clients access auth headers
app.use((req, res, next) => {
    res.set({ "Access-Control-Expose-Headers": "accesstoken, refreshtoken" });
    next();
});

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
    app.use("/api/auth", authLimiter);
}

// v1 api routes
app.use("/api", routes);

// v1 api routes

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
