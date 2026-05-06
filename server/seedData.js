const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Student = require('./models/Student');

const seedStudents = [
  { name: 'Aarav Sharma', roll: 'CS2301', semester1: { present: 46, absent: 4 }, semester2: { present: 43, absent: 5 } },
  { name: 'Ishita Verma', roll: 'CS2302', semester1: { present: 38, absent: 12 }, semester2: { present: 35, absent: 11 } },
  { name: 'Rohan Mehta', roll: 'CS2303', semester1: { present: 31, absent: 18 }, semester2: { present: 29, absent: 17 } },
  { name: 'Sneha Reddy', roll: 'CS2304', semester1: { present: 44, absent: 6 }, semester2: { present: 41, absent: 7 } },
  { name: 'Karthik Nair', roll: 'CS2305', semester1: { present: 36, absent: 14 }, semester2: { present: 33, absent: 15 } },
  { name: 'Priya Iyer', roll: 'CS2306', semester1: { present: 47, absent: 3 }, semester2: { present: 45, absent: 3 } },
  { name: 'Aditya Kulkarni', roll: 'CS2307', semester1: { present: 34, absent: 16 }, semester2: { present: 30, absent: 18 } },
  { name: 'Nandini Rao', roll: 'CS2308', semester1: { present: 40, absent: 10 }, semester2: { present: 39, absent: 9 } },
  { name: 'Vikram Singh', roll: 'CS2309', semester1: { present: 28, absent: 22 }, semester2: { present: 27, absent: 21 } },
  { name: 'Meera Joshi', roll: 'CS2310', semester1: { present: 42, absent: 8 }, semester2: { present: 40, absent: 8 } },
  { name: 'Harsh Patel', roll: 'CS2311', semester1: { present: 33, absent: 17 }, semester2: { present: 31, absent: 17 } },
  { name: 'Ananya Gupta', roll: 'CS2312', semester1: { present: 45, absent: 5 }, semester2: { present: 44, absent: 4 } },
  { name: 'Rahul Choudhary', roll: 'CS2313', semester1: { present: 37, absent: 13 }, semester2: { present: 34, absent: 14 } },
  { name: 'Kavya Menon', roll: 'CS2314', semester1: { present: 41, absent: 9 }, semester2: { present: 38, absent: 10 } },
  { name: 'Arjun Desai', roll: 'CS2315', semester1: { present: 30, absent: 20 }, semester2: { present: 28, absent: 20 } },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Student.deleteMany({});
    console.log('Cleared existing students');

    const created = await Student.insertMany(seedStudents);
    console.log(`Seeded ${created.length} students`);

    await mongoose.connection.close();
    console.log('Done — connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
