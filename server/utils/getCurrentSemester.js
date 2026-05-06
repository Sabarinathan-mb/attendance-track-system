/**
 * Determines the current academic semester based on the calendar month.
 * Jan–Jun → Semester 2, Jul–Dec → Semester 1
 * @returns {1|2} The current semester number.
 */
const getCurrentSemester = () => {
  const month = new Date().getMonth() + 1;
  return month >= 1 && month <= 6 ? 2 : 1;
};

module.exports = getCurrentSemester;
