require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();
const PORT = 5000 || process.env.PORT;

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// view engine
app.set("view engine", "ejs");

// database connection
connectDB();

// routes
app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`App's listening on port ${PORT}`);
});