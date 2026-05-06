import { useState } from 'react';
import { addStudent } from '../services/api';

export default function AddStudentForm({ onStudentAdded }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    name: '',
    roll: '',
    s1p: '0',
    s1a: '0',
    s2p: '0',
    s2a: '0',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({ name: '', roll: '', s1p: '0', s1a: '0', s2p: '0', s2a: '0' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        roll: form.roll,
        semester1: { present: Number(form.s1p), absent: Number(form.s1a) },
        semester2: { present: Number(form.s2p), absent: Number(form.s2a) },
      };

      const result = await addStudent(payload);
      setMessage({ type: 'success', text: `${result.student.name} added successfully.` });
      resetForm();
      if (onStudentAdded) onStudentAdded();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-section">
      <button className="add-toggle" type="button" onClick={() => setOpen(!open)}>
        <span className={`add-toggle-icon ${open ? 'open' : ''}`}>+</span>
        Add New Student
      </button>

      {open && (
        <form className="add-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="add-name">Full Name</label>
              <input
                id="add-name"
                className="form-input"
                name="name"
                type="text"
                placeholder="Enter student name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="add-roll">Roll Number</label>
              <input
                id="add-roll"
                className="form-input"
                name="roll"
                type="text"
                placeholder="e.g. CS2316"
                value={form.roll}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row" style={{ marginTop: 12 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="add-s1p">Sem 1 Present</label>
              <input id="add-s1p" className="form-input" name="s1p" type="number" min="0" value={form.s1p} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="add-s1a">Sem 1 Absent</label>
              <input id="add-s1a" className="form-input" name="s1a" type="number" min="0" value={form.s1a} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row" style={{ marginTop: 12 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="add-s2p">Sem 2 Present</label>
              <input id="add-s2p" className="form-input" name="s2p" type="number" min="0" value={form.s2p} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="add-s2a">Sem 2 Absent</label>
              <input id="add-s2a" className="form-input" name="s2a" type="number" min="0" value={form.s2a} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Adding…' : 'Add Student'}
            </button>
            {message && (
              <span className={`form-message ${message.type}`}>{message.text}</span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
