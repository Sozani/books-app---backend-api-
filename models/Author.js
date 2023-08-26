const mongoose = require("mongoose");
const Joi = require("joi");
const AuthorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    image: {
      type: String,
      default: "default-avatar.png",
    },
  },
  { timestamps: true }
);
const Author = mongoose.model("Author", AuthorSchema);
// validate create book
function validateCreateAuthor(obj) {
  const schema = Joi.object({
    firstname: Joi.string().alphanum().min(3).max(30).trim().required(),
    lastname: Joi.string().min(3).max(30).trim().required(),
    nationality: Joi.string().alphanum().min(3).max(30).trim().required(),
    image: Joi.string().required(),
  });
  return schema.validate(obj);
}
// Validate update a book
function validateUpdateAuthor(obj) {
  const schema = Joi.object({
    firstName: Joi.string().alphanum().min(3).max(30).trim(),
    lastName: Joi.string().min(3).max(30).trim(),
    nationality: Joi.string().alphanum().min(3).max(30).trim(),
    image: Joi.string(),
  });

  return schema.validate(obj);
}
module.exports = { Author, validateUpdateAuthor, validateCreateAuthor };
