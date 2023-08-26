const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 100,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
//Generate token
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY
  );
};
const User = mongoose.model("User", UserSchema);
//validate Register User
function validationRegisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    username: Joi.string().trim().min(2).max(200).required(),
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}

//validate Login User
function validationLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),

    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}
function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email(),
    username: Joi.string().trim().min(2).max(200),
    password: Joi.string().trim().min(6),
  });
  return schema.validate(obj);
}
module.exports = {
  User,
  validationRegisterUser,
  validationLoginUser,
  validateUpdateUser,
};
