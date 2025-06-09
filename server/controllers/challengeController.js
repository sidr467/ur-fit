const Challenge = require('../models/Challenge');
const User = require('../models/User')

exports.createChallenge = async (req, res) => {
    const {
        title,
        description,
        longDescription,
        totalDays,
        imageUrl,
        externalLink,
        pdfs
    } = req.body;

    try {
        const challenge = new Challenge({
            title,
            description,
            longDescription,
            totalDays,
            imageUrl,
            externalLink,
            pdfs
        });

        await challenge.save();
        res.status(201).json({ message: 'Challenge created successfully', challenge });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

exports.getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find().populate('participants', 'name email');
        res.status(200).json(challenges);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

exports.getChallengeById = async (req, res) => {
    const { id } = req.params;

    try {
        const challenge = await Challenge.findById(id).populate('participants', 'name email');
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.status(200).json(challenge);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

exports.joinChallenge = async (req, res) => {
    const challengeId = req.params.id;
    const userId = req.user.userId; // Assumes you have authentication middleware that sets req.user

    try {
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        // Prevent duplicate joins
        if (challenge.participants.includes(userId)) {
            return res.status(400).json({ message: 'Already joined this challenge' });
        }

        challenge.participants.push(userId);
        challenge.participantCount = challenge.participants.length;
        await challenge.save();

         await User.findByIdAndUpdate(
            userId,
            { $addToSet: { joinedChallenges: challengeId } }
        );

        res.status(200).json({ message: 'Joined challenge successfully', challenge });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getUserJoinedChallenges = async (req, res) => {
    const userId = req.user.userId; // Assumes you have authentication middleware that sets req.user

    try {
        const user = await User.findById(userId).populate('joinedChallenges');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.joinedChallenges);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}