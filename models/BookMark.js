const mongoose = require("mongoose");

const BookMarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feed: {
      type: mongoose.Types.ObjectId,
      ref: "Feed",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("BookMark", BookMarkSchema);
