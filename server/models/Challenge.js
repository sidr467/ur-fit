const mongoose = require("mongoose")

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    participantCount: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
    },
    externalLink: [
      {
        type: String,
      },
    ],
    pdfs: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Challenge", challengeSchema)
