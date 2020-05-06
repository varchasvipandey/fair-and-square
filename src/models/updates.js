const mongoose = require("mongoose");

const updatesSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true
    },
    released: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Updates = mongoose.model("Updates", updatesSchema);

module.exports = Updates;
