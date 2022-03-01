const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// create post
router.post("/", async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ message: "please fill all required details" });
    }

    const newPost = new Post(req.body);

    const post = await newPost.save();

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
