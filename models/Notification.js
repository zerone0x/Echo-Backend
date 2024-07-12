const mongoose = require("mongoose");
const { ActionEnum } = require("../utils/data");

const NotificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: mongoose.Types.ObjectId,
      ref: "Feed",
    },
    type: {
      type: String,
      enum: ["Comment", "Feed"],
    },
    action: {
      type: String,
      enum: Object.values(ActionEnum),
      required: true,
    },
    status: {
      type: String,
      default: "unread",
      enum: ["unread", "read"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Notification", NotificationSchema);
