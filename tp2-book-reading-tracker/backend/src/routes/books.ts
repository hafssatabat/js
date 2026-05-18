import express, { Request, Response } from "express";
import Book from "../models/Book";

const router = express.Router();

// GET all books
router.get("/", async (req: Request, res: Response) => {
  try {
    const books = await Book.find().sort({
      createdAt: -1,
    });

    res.json(books);
  } catch {
    res.status(500).json({
      message: "Erreur lors de la récupération des livres",
    });
  }
});

// CREATE book
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      title,
      author,
      pages,
      status,
      price,
      pagesRead,
      format,
      suggestedBy,
    } = req.body;

    if (pagesRead > pages) {
      return res.status(400).json({
        message:
          "Le nombre de pages lues doit être inférieur ou égal au nombre total de pages",
      });
    }

    const isFinished = pagesRead >= pages;

    const book = new Book({
      title,
      author,
      pages,
      status: isFinished ? "Read" : status,
      price,
      pagesRead,
      format,
      suggestedBy,
      finished: isFinished,
    });

    await book.save();

    res.status(201).json(book);
  } catch {
    res.status(500).json({
      message: "Erreur lors de l'ajout du livre",
    });
  }
});

// UPDATE book
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { pagesRead, finished } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Livre introuvable",
      });
    }

    // Checkbox "Livre terminé"
    if (finished !== undefined) {
      book.finished = finished;

      if (finished) {
        book.status = "Read";
        book.pagesRead = book.pages;
      } else {
        book.status = "Currently reading";
        book.pagesRead = 0;
      }
    }

    // Update pagesRead
    if (pagesRead !== undefined) {
      if (pagesRead > book.pages) {
        return res.status(400).json({
          message: "Pages lues ne peut pas dépasser le total",
        });
      }

      book.pagesRead = pagesRead;
      book.finished = pagesRead >= book.pages;

      if (book.finished) {
        book.status = "Read";
      }
    }

    await book.save();

    res.json(book);
  } catch {
    res.status(500).json({
      message: "Erreur lors de la modification",
    });
  }
});

// DELETE book
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Book.findByIdAndDelete(req.params.id);

    res.json({
      message: "Livre supprimé avec succès",
    });
  } catch {
    res.status(500).json({
      message: "Erreur lors de la suppression du livre",
    });
  }
});

export default router;