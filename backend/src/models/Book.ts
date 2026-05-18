import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    pages: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Read",
        "Re-read",
        "DNF",
        "Currently reading",
        "Returned unread",
        "Want to read",
      ],
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    pagesRead: {
      type: Number,
      default: 0,
    },

    format: {
      type: String,
      enum: [
        "Print",
        "PDF",
        "Ebook",
        "AudioBook",
      ],
      required: true,
    },

    suggestedBy: {
      type: String,
      default: "",
    },

    finished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model(
  "Book",
  bookSchema
);

export default Book;