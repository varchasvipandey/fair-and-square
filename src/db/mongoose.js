const mongoose = require("mongoose");

//connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
mongoose.connection.on("error", error => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on("connected", () => {
  console.log("Connected to the database");
});
