const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { authorization } = require("../middleware/authorization");

const router = express.Router();

//register route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res
        .status(400)
        .send({ message: "Please provide required credentials" });

    if ((await User.findOne({ username })) || (await User.findOne({ email })))
      return res
        .status(400)
        .send({ message: "this username or email is already taken" });

    const salt = await bcrypt.genSalt(2);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .send({ message: "Please provide required credentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: "wrong credentials" });

    const validate = await bcrypt.compare(password, user.password);
    if (!validate)
      return res.status(400).send({ message: "wrong credentials" });

    // creating JWT token and store into cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });

    return res
      .status(200)
      .cookie("jwt", token, { httpOnly: true })
      .send({ token: token });
  } catch (err) {
    return res.status(500).send(err);
  }
});

//logout route
router.get("/logout", authorization, (req, res) => {
  return res
    .clearCookie("jwt")
    .status(200)
    .send({ message: "logout successfully" });
});

module.exports = router;
