const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema(
  {
    present: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Present days cannot be negative'],
    },
    absent: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Absent days cannot be negative'],
    },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    roll: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, 'Roll number cannot exceed 20 characters'],
    },
    semester1: {
      type: semesterSchema,
      default: () => ({ present: 0, absent: 0 }),
    },
    semester2: {
      type: semesterSchema,
      default: () => ({ present: 0, absent: 0 }),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

studentSchema.virtual('semester1Percentage').get(function () {
  const total = this.semester1.present + this.semester1.absent;
  return total === 0 ? 0 : Math.round((this.semester1.present / total) * 100);
});

studentSchema.virtual('semester2Percentage').get(function () {
  const total = this.semester2.present + this.semester2.absent;
  return total === 0 ? 0 : Math.round((this.semester2.present / total) * 100);
});

studentSchema.virtual('totalPresent').get(function () {
  return this.semester1.present + this.semester2.present;
});

studentSchema.virtual('totalAbsent').get(function () {
  return this.semester1.absent + this.semester2.absent;
});

studentSchema.virtual('totalDays').get(function () {
  return this.totalPresent + this.totalAbsent;
});

studentSchema.virtual('percentage').get(function () {
  const days = this.totalDays;
  return days === 0 ? 0 : Math.round((this.totalPresent / days) * 100);
});


module.exports = mongoose.model('Student', studentSchema);
