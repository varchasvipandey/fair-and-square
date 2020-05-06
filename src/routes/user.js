const express = require("express");
const User = require("../models/user");
const router = new express.Router();

//signup user
router.post("/users", async (req, res) => {
  let user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//login user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentails(
      req.body.email,
      req.body.password
    );
    //generate token
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//delete user
router.delete("/users/delete", async (req, res) => {
  try {
    const token = req.body.token;
    const user = await User.findOne({
      "tokens.token": token
    });
    if (!user) return res.status(404).send();
    await user.remove();
    res.send(user);
  } catch (error) {
    res.status(500);
  }
});

module.exports = router;
