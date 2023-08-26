const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
// const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const {
  Author,
  validateCreateAuthor,
  validateUpdateAuthor,
} = require("../models/Author");

// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh
/* 
@desc Get all authors
@route /api/authors
@method Get
@ access public
*/
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const authorList = await Author.find();

    res.status(200).json(authorList);
  })
);
// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
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
    const author = await Author.findById(req.params.id);

    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json({ message: "Author not found" });
    }
  })
);
// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
// Post a new author
/* 
@desc Create a new author
@route /api/author
@method Post
@ access private (only admin)
*/
router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateCreateAuthor(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    console.log(req.body);

    const author = new Author({
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      nationality: req.body.nationality,
      image: req.body.image,
    });
    const result = await author.save();

    res.status(201).json(result);
  })
);
// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
// Delete an author
/* 
@desc Delete an author
@route /api/authers/:id
@method Delete
@ access private (only admin)
*/
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);

    if (author) {
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json("Author has been deleted");
    } else {
      res.status(404).json({ message: "Author not deleted" });
    }
  })
);
// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH

// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
// Update an author
/* 
@desc Update the author
@route /api/authors/:id
@method Put
@ access private (only admin)
*/
router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const author = await Author.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          nationality: req.body.nationality,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(author);
  })
);
// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH

module.exports = router;
