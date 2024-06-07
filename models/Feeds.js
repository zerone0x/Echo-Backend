const mongoose = require("mongoose");

const FeedsSchema = new mongoose.Schema(
  {
    Content: {
      type: text,
      trim: true,
      required: [true, "Please provide content"],
      maxlength: [170, "Content should be less than 170 characters"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Feed", FeedsSchema);
