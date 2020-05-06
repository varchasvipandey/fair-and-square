const jwt = require("jsonwebtoken");

//middleware to keep track of the accessed paths
const auth = async (req, res, next) => {
  try {
    //check key
    let updateKey = req.body.key;
    if (updateKey === undefined)
      return res.status(401).send({ error: "unauthorized" });
    let decoded = jwt.verify(updateKey, process.env.JWT_UPDATE_SECRET);
    if (decoded !== "updatepush")
      return res.status(401).send({ error: "unauthorized" });

    req.update = {
      description: req.body.description,
      released: req.body.released
    };

    next();
  } catch (error) {
    res.status(401).send({ error: "Unauthorized" });
  }
};

module.exports = auth;
