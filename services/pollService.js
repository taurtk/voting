const prisma = require('../config/database');

class PollService {
  async createPoll(userId, question, options) {
    const poll = await prisma.poll.create({
      data: {
        question,
        userId,
        options: {
          create: options.map(option => ({ text: option })),
        },
      },
      include: {
        options: true,
      },
    });
    return poll;
  }

  async getPollById(id) {
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            votes: true,
          },
        },
      },
    });
    return poll;
  }

  async getAllPolls() {
    const polls = await prisma.poll.findMany({
      include: {
        options: {
          include: {
            votes: true,
          },
        },
      },
    });
    return polls;
  }

  async publishPoll(id) {
    const poll = await prisma.poll.update({
      where: { id },
      data: { isPublished: true },
    });
    return poll;
  }
}

module.exports = new PollService();