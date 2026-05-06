import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents, markAttendance } from '../services/api';

/* Inline SVG icons */
const CheckIcon = () => (
  <svg className="toggle-icon" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,7 5.5,10.5 12,3.5" />
  </svg>
);

const XIcon = () => (
  <svg className="toggle-icon" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="3" x2="11" y2="11" />
    <line x1="11" y1="3" x2="3" y2="11" />
  </svg>
);

export default function MarkAttendancePage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
        const initial = {};
        data.forEach((s) => { initial[s._id] = 'present'; });
        setEntries(initial);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggle = (id, type) => {
    setEntries((prev) => ({ ...prev, [id]: type }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = Object.entries(entries).map(([studentId, type]) => ({ studentId, type }));
      await markAttendance(payload);
      navigate('/', { state: { toast: 'Attendance saved successfully' } });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <div className="state-box"><div className="spinner" /><p>Loading students…</p></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-layout">
        <div className="state-box"><p className="error-text">{error}</p></div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const presentCount = Object.values(entries).filter((t) => t === 'present').length;
  const absentCount  = Object.values(entries).filter((t) => t === 'absent').length;

  return (
    <div className="app-layout">
      <div className="page-header">
        <h1>Mark Attendance</h1>
        <p>{today}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Select attendance for each student</h2>
              <p>
                {students.length} students&nbsp;·&nbsp;
                <span style={{ color: 'var(--emerald)' }}>{presentCount} present</span>
                {absentCount > 0 && (
                  <>, <span style={{ color: 'var(--rose)' }}>{absentCount} absent</span></>
                )}
              </p>
            </div>
          </div>

          <div className="panel-body">
            <div className="attendance-list">
              {students.map((s) => (
                <div key={s._id} className="attendance-row">
                  <div className="attendance-info">
                    <span className="attendance-name">{s.name}</span>
                    <span className="attendance-meta">{s.roll}&nbsp;·&nbsp;{s.percentage}% current</span>
                  </div>
                  <div className="toggle-group">
                    <label className={`toggle-option ${entries[s._id] === 'present' ? 'selected-present' : ''}`}>
                      <input
                        type="radio"
                        name={`att-${s._id}`}
                        value="present"
                        checked={entries[s._id] === 'present'}
                        onChange={() => toggle(s._id, 'present')}
                      />
                      <CheckIcon />
                      Present
                    </label>
                    <label className={`toggle-option ${entries[s._id] === 'absent' ? 'selected-absent' : ''}`}>
                      <input
                        type="radio"
                        name={`att-${s._id}`}
                        value="absent"
                        checked={entries[s._id] === 'absent'}
                        onChange={() => toggle(s._id, 'absent')}
                      />
                      <XIcon />
                      Absent
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="add-section">
            <div className="form-actions">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save Attendance'}
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => navigate('/')}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
