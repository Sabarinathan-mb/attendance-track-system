const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      enum: {
        values: [1, 2],
        message: 'Semester must be 1 or 2',
      },
    },
    type: {
      type: String,
      required: [true, 'Attendance type is required'],
      enum: {
        values: ['present', 'absent'],
        message: 'Type must be present or absent',
      },
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ student: 1, date: 1, semester: 1 }, { unique: true });
attendanceSchema.index({ student: 1, date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
