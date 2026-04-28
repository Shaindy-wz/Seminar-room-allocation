const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/search', roomController.findAvailableRooms);
router.post('/', roomController.fitIn);

module.exports = router;