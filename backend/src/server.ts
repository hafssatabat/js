import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import bookRoutes from "./routes/books";

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Route accueil
app.get("/", (req, res) => {
  res.send("API Book Reading Tracker fonctionne");
});

// Routes books
app.use("/books", bookRoutes);

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/book-reading-tracker")
  .then(() => {
    console.log("MongoDB connecté");

    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });