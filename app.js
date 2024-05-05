require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000 || process.env.PORT;

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

// view engine
app.set("view engine", "ejs");

connectDB();

app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`App's listening on port ${PORT}`);
});