const Challenge = require("../models/Challenge")
const User = require("../models/User")

exports.createChallenge = async (req, res) => {
  const {
    title,
    description,
    longDescription,
    totalDays,
    imageUrl,
    externalLink,
    pdfs,
  } = req.body

  try {
    const challenge = new Challenge({
      title,
      description,
      longDescription,
      totalDays,
      imageUrl,
      externalLink,
      pdfs,
    })

    await challenge.save()
    res
      .status(201)
      .json({ message: "Challenge created successfully", challenge })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

exports.getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().populate(
      "participants",
      "name email"
    )
    res.status(200).json(challenges)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

exports.getChallengeById = async (req, res) => {
  const { id } = req.params

  try {
    const challenge = await Challenge.findById(id).populate(
      "participants",
      "name email"
    )
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" })
    }
    res.status(200).json(challenge)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

exports.joinChallenge = async (req, res) => {
  const challengeId = req.params.id
  const userId = req.user.userId

  try {
    const challenge = await Challenge.findById(challengeId)
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" })
    }

    if (challenge.participants.includes(userId)) {
      return res.status(400).json({ message: "Already joined this challenge" })
    }

    challenge.participants.push(userId)
    challenge.participantCount = challenge.participants.length
    await challenge.save()

    await User.findByIdAndUpdate(userId, {
      $addToSet: { joinedChallenges: challengeId },
    })

    res
      .status(200)
      .json({ message: "Joined challenge successfully", challenge })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

exports.getUserJoinedChallenges = async (req, res) => {
  const userId = req.user.userId

  try {
    const user = await User.findById(userId).populate("joinedChallenges")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json(user.joinedChallenges)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

exports.userEnrollment = async (req, res) => {
  try {
    if (req.user.role !== "coordinator") {
      return res.status(403).json({ message: "Access denied" })
    }

    const { userId, challengeId } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const challenge = await Challenge.findById(challengeId)
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" })
    }

    if (challenge.participants.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User already enrolled in this challenge" })
    }

    challenge.participants.push(userId)
    challenge.participantCount = challenge.participants.length
    await challenge.save()

    user.joinedChallenges.push(challengeId)
    await user.save()

    res.json({ message: "User enrolled in challenge successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

exports.addChallengeLink = async (req, res) => {
  const { id } = req.params;
  const { link } = req.body;

  try {
    const challenge = await Challenge.findByIdAndUpdate(
      id,
      { $push: { externalLink: link } },
      { new: true }
    );
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    res.status(200).json({ message: "Link added successfully", challenge });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateSingleChallengeLink = async (req, res) => {
  const { id } = req.params;
  const { index, newLink } = req.body; 

  try {
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    if (
      !Array.isArray(challenge.externalLink) ||
      index < 0 ||
      index >= challenge.externalLink.length
    ) {
      return res.status(400).json({ message: "Invalid link index" });
    }
    challenge.externalLink[index] = newLink;
    await challenge.save();
    res.status(200).json({ message: "Link updated successfully", challenge });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addChallengePdf = async (req, res) => {
  const { id } = req.params;
  const { pdf } = req.body;

  try {
    const challenge = await Challenge.findByIdAndUpdate(
      id,
      { $push: { pdfs: pdf } },
      { new: true }
    );
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    res.status(200).json({ message: "PDF added successfully", challenge });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateSingleChallengePdf = async (req, res) => {
  const { id } = req.params;
  const { index, newPdf } = req.body; 

  try {
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    if (
      !Array.isArray(challenge.pdfs) ||
      index < 0 ||
      index >= challenge.pdfs.length
    ) {
      return res.status(400).json({ message: "Invalid PDF index" });
    }
    challenge.pdfs[index] = newPdf;
    await challenge.save();
    res.status(200).json({ message: "PDF updated successfully", challenge });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a single link by index
exports.deleteSingleChallengeLink = async (req, res) => {
  const { id } = req.params;
  const { index } = req.body;

  try {
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    if (
      !Array.isArray(challenge.externalLink) ||
      index < 0 ||
      index >= challenge.externalLink.length
    ) {
      return res.status(400).json({ message: "Invalid link index" });
    }
    challenge.externalLink.splice(index, 1);
    await challenge.save();
    res.status(200).json({ message: "Link deleted successfully", challenge });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a single PDF by index
exports.deleteSingleChallengePdf = async (req, res) => {
  const { id } = req.params;
  const { index } = req.body; 

  try {
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    if (
      !Array.isArray(challenge.pdfs) ||
      index < 0 ||
      index >= challenge.pdfs.length
    ) {
      return res.status(400).json({ message: "Invalid PDF index" });
    }
    challenge.pdfs.splice(index, 1);
    await challenge.save();
    res.status(200).json({ message: "PDF deleted successfully", challenge });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.editChallenge = async (req, res) => {
  const { id } = req.params;
  const { title, description, longDescription } = req.body;

  try {
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    if (title !== undefined) challenge.title = title;
    if (description !== undefined) challenge.description = description;
    if (longDescription !== undefined) challenge.longDescription = longDescription;

    await challenge.save();

    res.status(200).json({ message: "Challenge updated successfully", challenge });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteChallenge = async (req, res) => {
  const { id } = req.params;
  try {
    const challenge = await Challenge.findByIdAndDelete(id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    // Optionally, remove this challenge from users' joinedChallenges arrays
    await User.updateMany(
      { joinedChallenges: id },
      { $pull: { joinedChallenges: id } }
    );
    res.status(200).json({ message: "Challenge deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};