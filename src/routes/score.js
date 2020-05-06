const express = require("express");
const User = require("../models/user");
const router = new express.Router();

//update user score
router.patch("/users/score/", async (req, res) => {
  try {
    const token = req.body.token;

    const user = await User.findOne({
      "tokens.token": token,
    });

    if (!user) return res.status(404).send();
    user.score = req.body.score;
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500);
  }
});

//
router.post("/scores", async (req, res) => {
  const users = await User.find({}, "name score").sort({ score: -1 }).limit(5);
  res.status(200).json(users);
});

module.exports = router;
