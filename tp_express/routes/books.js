const express = require("express");

const router = express.Router();

let books = [];

// Middleware
function isAuthenticated(req, res, next) {

  if (req.session.user) {
    return next();
  }

  return res.status(401).json({
    message: "Authentication required"
  });
}

router.use(isAuthenticated);


// GET books
router.get("/", (req, res) => {
  res.json(books);
});


// CREATE book
router.post("/", (req, res) => {

  const { title, author } = req.body;

  const book = {
    id: books.length + 1,
    title,
    author
  };

  books.push(book);

  res.status(201).json(book);
});

module.exports = router;