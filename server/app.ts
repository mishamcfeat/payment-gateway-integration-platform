const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("express-async-errors");

// routes for the backend

const app = express();

// use the routes for the backend

// cors middleware to allow the app to accept requests from the frontend
app.use({ origin: "http://localhost:5173", credentials: true });
// allow the app to parse incoming requests with JSON payloads to req.body
app.use(express.json());
// allow the app to parse incoming requests with urlencoded payloads to req.body
app.use(express.urlencoded({ extended: true }));
// allow the app to parse incoming requests with cookie payloads to req.cookies
app.use(cookieParser());

// error handling middleware using express-async-errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!", err: err.message);
});

module.exports = app;
