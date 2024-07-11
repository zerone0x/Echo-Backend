const mongoose = require("mongoose");

const BookMarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookmarkedItem: {
      type: mongoose.Types.ObjectId,
      required: true,
      refPath: "type",
    },
    type: {
      type: String,
      required: true,
      enum: ["Comment", "Feed"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("BookMark", BookMarkSchema);
