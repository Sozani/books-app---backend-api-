const express = require("express");
const Joi = require("joi");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  Book,
  validateCreateBook,
  validateUpdateBook,
} = require("../models/Book");

// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
/* 
@desc Get all books
@route /api/books
@method Get
@ access public
*/
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.find().populate("author", [
      "firstName",
      "lastName",
      "_id",
    ]);

    res.status(200).json(books);
  })
);
// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
// Get book by Id
/* 
@desc Get  a specific book
@route /api/books/:id
@method Get
@ access public
*/
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("author");
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  })
);
// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
// Post a new book
/* 
@desc Create a new book
@route /api/books
@method Post
@ access private (only admin)
*/
router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateCreateBook(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    console.log(req.body);
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover,
    });
    const result = await book.save();
    res.status(201).json(result);
  })
);

// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
// Update a book
/* 
@desc Update the book
@route /api/books/:id
@method Put
@ access private (only admin)
*/
router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateBook(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          price: req.body.price,
          cover: req.body.cover,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedBook);
  })
);
// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
// Delete a book
/* 
@desc Delete a book
@route /api/books/:id
@method Delete
@ access private (only admin)
*/
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
      await Book.findByIdAndDelete(req.params.id);
      res.status(200).json("Book has been deleted");
    } else {
      res.status(404).json({ message: "Book not deleted" });
    }
  })
);

// export route
module.exports = router;
