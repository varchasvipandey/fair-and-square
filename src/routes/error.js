const express = require("express");
const path = require("path");
const router = new express.Router();

// 404
router.use((req, res, next) => {
  return res.status(404).sendFile(path.join(__dirname + "/../public/404.html"));
});

// 500 - Any server error
router.use((err, req, res, next) => {
  return res.status(500).sendFile(path.join(__dirname + "/../public/404.html"));
});

module.exports = router;
