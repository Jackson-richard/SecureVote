const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/vote', authMiddleware, voteController.vote);
router.get('/candidates', voteController.getResults); // Public results



module.exports = router;
