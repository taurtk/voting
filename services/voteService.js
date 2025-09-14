const prisma = require('../config/database');

class VoteService {
  async vote(userId, pollOptionId) {
    // Check if user has already voted in this poll
    const pollOption = await prisma.pollOption.findUnique({
      where: { id: pollOptionId },
      include: { poll: true },
    });

    if (!pollOption) {
      throw new Error('Poll option not found');
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        userId,
        pollOption: {
          pollId: pollOption.pollId,
        },
      },
    });

    if (existingVote) {
      throw new Error('User has already voted in this poll');
    }

    const vote = await prisma.vote.create({
      data: {
        userId,
        pollOptionId,
      },
    });

    return vote;
  }

  async getVoteCounts(pollId) {
    const options = await prisma.pollOption.findMany({
      where: { pollId },
      include: {
        votes: true,
      },
    });

    return options.map(option => ({
      id: option.id,
      text: option.text,
      voteCount: option.votes.length,
    }));
  }
}

module.exports = new VoteService();