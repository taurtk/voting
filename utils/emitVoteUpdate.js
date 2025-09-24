let io;

const setIo = (socketIo) => {
  io = socketIo;
};

const emitVoteUpdate = (pollId, voteCounts) => {
  if (io) {
    io.to(pollId).emit('vote_cast', { pollId, voteCounts });
  }
};

module.exports = { setIo, emitVoteUpdate };