const express = require("express");
const path = require("path");
const router = new express.Router();

//home
router.get("/home", async (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/home.html"));
});

//in the world of fl studio
router.get("/game1", async (req, res) => {
  res.sendFile(
    path.join(
      __dirname + "/../public/games/in_the_world_of_FL_studio/game.html"
    )
  );
});

//dragon pong
router.get("/game2", async (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/games/dragon_pong/game.html"));
});

module.exports = router;
