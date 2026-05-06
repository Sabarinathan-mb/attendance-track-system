const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/attendanceController');

router.post('/', ctrl.markAttendance);
router.get('/:studentId', ctrl.getHistory);

module.exports = router;
