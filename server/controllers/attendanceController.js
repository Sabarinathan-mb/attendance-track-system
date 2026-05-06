const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const getCurrentSemester = require('../utils/getCurrentSemester');

exports.markAttendance = async (req, res, next) => {
  try {
    const { entries } = req.body;

    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: 'Attendance entries array is required' });
    }

    const semester = getCurrentSemester();
    const today = new Date().toISOString().split('T')[0];
    const results = [];
    const errors = [];

    for (const entry of entries) {
      const { studentId, type } = entry;

      if (!studentId || !['present', 'absent'].includes(type)) {
        errors.push({ studentId, error: 'Invalid entry data' });
        continue;
      }

      try {
        const student = await Student.findById(studentId);
        if (!student) {
          errors.push({ studentId, error: 'Student not found' });
          continue;
        }

        const existing = await Attendance.findOne({
          student: studentId,
          date: today,
          semester,
        });

        if (existing) {
          // Update existing record if attendance was already marked
          const oldType = existing.type;
          existing.type = type;
          await existing.save();

          // Reverse old count and apply new count
          if (oldType !== type) {
            student[`semester${semester}`][oldType] -= 1;
            student[`semester${semester}`][type] += 1;
            await student.save();
          }
        } else {
          await Attendance.create({
            student: studentId,
            date: today,
            semester,
            type,
          });

          student[`semester${semester}`][type] += 1;
          await student.save();
        }

        results.push({ studentId, type, status: 'saved' });
      } catch (err) {
        errors.push({ studentId, error: err.message });
      }
    }

    return res.json({
      message: `Attendance saved for ${results.length} student(s)`,
      saved: results.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const history = await Attendance.find({ student: studentId })
      .sort({ date: -1 })
      .limit(100)
      .lean();

    return res.json(history);
  } catch (error) {
    next(error);
  }
};
