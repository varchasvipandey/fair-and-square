const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("./db/mongoose");
//routes
const userRouter = require("./routes/user");
const scoreRouter = require("./routes/score");
const gameRouter = require("./routes/game");
const errorRouter = require("./routes/error");
const updateRouter = require("./routes/updates");

const app = express();
const port = process.env.PORT;

//parse form body
app.use(bodyParser.urlencoded({ extended: true }));

//middleware to load static css, js and img
app.use("/static", express.static(__dirname + "/public/static"));
//middleware to load assets
app.use("/assets", express.static(__dirname + "/public/games/assets"));
//manifest and sw
app.use("/app", express.static(__dirname + "/public/app"));
//main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.use(express.json());
app.use(gameRouter);
app.use(scoreRouter);
app.use(updateRouter);
app.use(userRouter);
app.use(errorRouter);

app.listen(port, () => console.log(`Server started on port ${port}`));
