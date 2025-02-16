const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
ConversationSchema.index({ participants: 1 });

// Pre-save middleware to ensure exactly 2 participants
ConversationSchema.pre("save", function (next) {
  if (this.participants.length !== 2) {
    next(new Error("A conversation must have exactly 2 participants"));
  }
  next();
});

module.exports = mongoose.model("Conversation", ConversationSchema);
