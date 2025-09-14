const pollService = require('../services/pollService');
const voteService = require('../services/voteService');
const { emitVoteUpdate } = require('../server');
const pollService = require('../services/pollService');
const voteService = require('../services/voteService');

class PollController {
  async createPoll(req, res) {
    try {
      const { question, options } = req.body;
      const userId = req.user.id; // Assuming auth middleware sets req.user
      const poll = await pollService.createPoll(userId, question, options);
      res.status(201).json(poll);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPoll(req, res) {
    try {
      const { id } = req.params;
      const poll = await pollService.getPollById(id);
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }
      res.json(poll);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllPolls(req, res) {
    try {
      const polls = await pollService.getAllPolls();
      res.json(polls);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async publishPoll(req, res) {
    try {
      const { id } = req.params;
      const poll = await pollService.publishPoll(id);
      res.json(poll);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async vote(req, res) {
    try {
      const { id } = req.params;
      const { pollOptionId } = req.body;
      const userId = req.user.id;
      const vote = await voteService.vote(userId, pollOptionId);
      const voteCounts = await voteService.getVoteCounts(id);
      emitVoteUpdate(id, voteCounts); // Emit real-time update
      res.json({ vote, voteCounts });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PollController();