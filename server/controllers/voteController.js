const blockchainService = require('../services/blockchainService');

// In-memory vote tracking (redundant with blockchain but good for quick checks)
// Actually leveraging blockchain for source of truth is better, but for speed we can check local db too.
// Since we have users array in authController, we should update that too if we want sync.
// For now, let's trust the blockchain service to throw if user already voted.

exports.vote = async (req, res) => {
    const { candidateId } = req.body;
    const userId = req.user.username; // Assuming middleware sets req.user

    if (candidateId === undefined) {
        return res.status(400).json({ message: 'Candidate ID is required' });
    }

    try {
        const txHash = await blockchainService.vote(candidateId, userId);
        res.json({ message: 'Vote cast successfully', transactionHash: txHash });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getResults = async (req, res) => {
    try {
        const candidates = await blockchainService.getAllCandidates();
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
