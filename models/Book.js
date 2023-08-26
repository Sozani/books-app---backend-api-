const mongoose = require("mongoose");
const Joi = require("joi");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
      trim: true,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    price: {
      type: Number,
      require: true,
      min: 0,
    },
    cover: {
      type: String,
      require: true,
      enum: ["soft cover", "hard cover"],
    },
  },
  { timestamps: true }
);
// validate create book
function validateCreateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().alphanum().min(3).max(250).trim(),
    author: Joi.string().required(),
    description: Joi.string().alphanum().min(5).trim(),
    price: Joi.number().integer(),
    cover: Joi.string().valid("soft cover", "hard cover"),
  });
  return schema.validate(obj);
}
// Validate update a book
function validateUpdateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().alphanum().min(3).max(250).trim(),
    author: Joi.string(),
    description: Joi.string().alphanum().min(5).trim(),
    price: Joi.number().integer(),
    cover: Joi.string().valid("soft cover", "hard cover"),
  });

  return schema.validate(obj);
}
const Book = mongoose.model("Book", BookSchema);
module.exports = { Book, validateUpdateBook, validateCreateBook };
