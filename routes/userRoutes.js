const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { searchUsersByEmail } = require('../controllers/userController');

const router = express.Router();

router.get('/search', protect, searchUsersByEmail);

module.exports = router;
