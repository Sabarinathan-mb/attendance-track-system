const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = res.status;
    throw error;
  }

  return data;
}

export function getStudents() {
  return request('/students');
}

export function getStudent(id) {
  return request(`/students/${id}`);
}

export function getSummary() {
  return request('/students/summary');
}

export function addStudent(payload) {
  return request('/students', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteStudent(id) {
  return request(`/students/${id}`, { method: 'DELETE' });
}

export function markAttendance(entries) {
  return request('/attendance', {
    method: 'POST',
    body: JSON.stringify({ entries }),
  });
}

export function getAttendanceHistory(studentId) {
  return request(`/attendance/${studentId}`);
}
