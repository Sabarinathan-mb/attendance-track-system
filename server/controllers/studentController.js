const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const getCurrentSemester = require('../utils/getCurrentSemester');

exports.getAllStudents = async (req, res, next) => {
  try {
    const docs = await Student.find().sort({ roll: 1 });
    const students = docs.map(doc => doc.toObject({ virtuals: true }));
    
    // Fetch recent history for previous attendance visibility
    const attendances = await Attendance.find().sort({ date: -1 }).lean();
    
    students.forEach(student => {
      student.recentHistory = attendances
        .filter(a => a.student.toString() === student._id.toString())
        .slice(0, 5) // Last 5 days
        .reverse(); // Chronological (oldest to newest among the 5)
    });

    students.sort((a, b) => a.percentage - b.percentage || a.name.localeCompare(b.name));
    res.json(students);
  } catch (error) {
    next(error);
  }
};

exports.getStudentById = async (req, res, next) => {
  try {
    const doc = await Student.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const student = doc.toObject({ virtuals: true });

    const history = await Attendance.find({ student: req.params.id })
      .sort({ date: -1 })
      .limit(50)
      .lean();

    return res.json({ ...student, attendanceHistory: history });
  } catch (error) {
    next(error);
  }
};

exports.getSummary = async (req, res, next) => {
  try {
    const docs = await Student.find();
    const students = docs.map(doc => doc.toObject({ virtuals: true }));

    if (students.length === 0) {
      return res.json({
        highest: null,
        lowest: null,
        totalStudents: 0,
        totalClassDays: 0,
        currentSemester: getCurrentSemester(),
      });
    }

    students.sort((a, b) => a.percentage - b.percentage);
    const lowest = students[0];
    const highest = students[students.length - 1];

    const maxDays = students.reduce(
      (max, s) => Math.max(max, s.totalDays),
      0
    );

    return res.json({
      highest: { _id: highest._id, name: highest.name, percentage: highest.percentage },
      lowest: { _id: lowest._id, name: lowest.name, percentage: lowest.percentage },
      totalStudents: students.length,
      totalClassDays: maxDays,
      currentSemester: getCurrentSemester(),
    });
  } catch (error) {
    next(error);
  }
};

exports.addStudent = async (req, res, next) => {
  try {
    const { name, roll, semester1, semester2 } = req.body;

    if (!name || !roll) {
      return res.status(400).json({ message: 'Name and roll number are required' });
    }

    const existing = await Student.findOne({ roll: roll.trim().toUpperCase() });
    if (existing) {
      return res.status(409).json({ message: 'That roll number already exists' });
    }

    const student = await Student.create({
      name: name.trim(),
      roll: roll.trim(),
      semester1: semester1 || { present: 0, absent: 0 },
      semester2: semester2 || { present: 0, absent: 0 },
    });

    const populated = (await Student.findById(student._id)).toObject({ virtuals: true });
    return res.status(201).json({ message: 'Student added successfully', student: populated });
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Attendance.deleteMany({ student: req.params.id });
    await Student.findByIdAndDelete(req.params.id);

    return res.json({ message: `${student.name} has been removed` });
  } catch (error) {
    next(error);
  }
};
