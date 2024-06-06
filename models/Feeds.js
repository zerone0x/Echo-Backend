const mongoose = require("mongoose");

const FeedsSchema = new mongoose.Schema({
  Content: {
    type: text,
    maxlength: [170, "Content should be less than 170 characters"],
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Feed", FeedsSchema);
