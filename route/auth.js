const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const {
  User,
  validationRegisterUser,
  validationLoginUser,
  validateUpdateUser,
} = require("../models/User.js");
// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh
/* 
@desc Register new users
@route /api/auth/register
@method Post
@ access public
*/
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { error } = validationRegisterUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400).json({ message: "This user already registered...!" });
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    const result = await user.save();
    const token = user.generateToken();
    const { password, ...other } = result._doc;

    res.status(201).json({ ...other, token });
  })
);
// HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh
/* 
@desc Login new users
@route /api/auth/login
@method Post
@ access public
*/
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { error } = validationLoginUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ message: "Invalid Email or Password...!" });
      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid Password or Email" });
      }
    }

    const token = user.generateToken();
    const { password, ...other } = user._doc;

    res.status(200).json({ ...other, token });
  })
);
module.exports = router;
