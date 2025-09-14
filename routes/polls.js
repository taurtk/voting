const express = require('express');
const pollController = require('../controllers/pollController');
const authMiddleware = require('../middleware/auth'); // We'll create this later

const router = express.Router();

router.post('/', authMiddleware, pollController.createPoll);
router.post('/:id/vote', authMiddleware, pollController.vote);
router.get('/', pollController.getAllPolls);
router.get('/:id', pollController.getPoll);
router.put('/:id/publish', authMiddleware, pollController.publishPoll);

module.exports = router;