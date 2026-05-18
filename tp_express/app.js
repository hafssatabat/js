const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const authRouter = require("./routes/auth");
const booksRouter = require("./routes/books");

const app = express();

app.use(express.json());

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false
  })
);

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/library")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/auth", authRouter);
app.use("/books", booksRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});