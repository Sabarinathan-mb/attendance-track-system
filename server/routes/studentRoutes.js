const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentController');

router.get('/', ctrl.getAllStudents);
router.get('/summary', ctrl.getSummary);
router.get('/:id', ctrl.getStudentById);
router.post('/', ctrl.addStudent);
router.delete('/:id', ctrl.deleteStudent);

module.exports = router;
