const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const Updates = require("../models/updates");
const router = new express.Router();

//add new update
router.post("/update", auth, async (req, res) => {
  let update = new Updates(req.update);
  try {
    await update.save();
    res.status(201).send(update);
  } catch (error) {
    res.status(400).send(error);
  }
});

//update existing update
router.patch("/update", auth, async (req, res) => {
  try {
    const update = await Updates.findOne({
      description: req.update.description
    });

    if (!update) return res.status(404).send();
    update.released = req.body.released;
    await update.save();
    res.send(update);
  } catch (error) {
    res.status(500);
  }
});

//get all updates
router.post("/getupdates", async (req, res) => {
  const updates = await Updates.find({}, "description released").sort({
    released: -1,
    updatedAt: -1
  });
  res.status(200).json(updates);
});

//delete an update
router.delete("/update", auth, async (req, res) => {
  try {
    const update = await Updates.findOne({
      description: req.update.description
    });
    if (!update) return res.status(404).send();
    await update.remove();
    res.send(update);
  } catch (error) {
    res.status(500);
  }
});

module.exports = router;
