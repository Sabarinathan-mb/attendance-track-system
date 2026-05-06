import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudent, deleteStudent } from '../services/api';
import StatusBadge from '../components/StatusBadge';

/* SVG circular progress ring */
function CircularProgress({ percentage }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;
  const color =
    percentage >= 90 ? 'var(--emerald)' :
    percentage >= 75 ? 'var(--amber)'   :
    'var(--rose)';

  return (
    <div className="circular-progress-wrap">
      <svg
        className="circular-progress-ring"
        width="120"
        height="120"
        viewBox="0 0 120 120"
      >
        {/* Track */}
        <circle
          className="ring-bg"
          cx="60" cy="60"
          r={radius}
          fill="none"
          stroke="var(--bg-active)"
          strokeWidth="7"
        />
        {/* Fill */}
        <circle
          className="ring-fill"
          cx="60" cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        {/* Percentage text */}
        <text
          x="60" y="55"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--text)"
          fontSize="20"
          fontWeight="700"
          fontFamily="var(--font)"
          letterSpacing="-1"
        >
          {percentage}%
        </text>
        <text
          x="60" y="72"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--text-muted)"
          fontSize="9"
          fontWeight="600"
          fontFamily="var(--font)"
          letterSpacing="1.5"
          textTransform="uppercase"
        >
          OVERALL
        </text>
      </svg>
    </div>
  );
}

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStudent(id);
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Remove ${student.name} from the class?`)) return;
    setDeleting(true);
    try {
      await deleteStudent(id);
      navigate('/', { state: { toast: `${student.name} has been removed` } });
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <div className="state-box"><div className="spinner" /><p>Loading student…</p></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-layout">
        <div className="state-box">
          <p className="error-text">{error}</p>
          <button className="btn btn-ghost" onClick={() => navigate('/')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="app-layout">
      <div className="detail-header">
        <div>
          <h1 className="detail-name">{student.name}</h1>
          <p className="detail-roll">
            {student.roll}&nbsp;·&nbsp;<StatusBadge percentage={student.percentage} />
          </p>
        </div>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Removing…' : 'Remove Student'}
        </button>
      </div>

      <div className="detail-grid">
        {/* Semester 1 */}
        <div className="detail-card">
          <h3>Semester 1</h3>
          <div className="detail-stat">
            <span className="detail-stat-label">Present</span>
            <span className="detail-stat-value">{student.semester1.present}</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-label">Absent</span>
            <span className="detail-stat-value">{student.semester1.absent}</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-label">Attendance</span>
            <span className="detail-stat-value">{student.semester1Percentage}%</span>
          </div>
        </div>

        {/* Semester 2 */}
        <div className="detail-card">
          <h3>Semester 2</h3>
          <div className="detail-stat">
            <span className="detail-stat-label">Present</span>
            <span className="detail-stat-value">{student.semester2.present}</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-label">Absent</span>
            <span className="detail-stat-value">{student.semester2.absent}</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-label">Attendance</span>
            <span className="detail-stat-value">{student.semester2Percentage}%</span>
          </div>
        </div>

        {/* Overall with circular progress */}
        <div className="detail-card overall">
          <h3>Overall</h3>
          <CircularProgress percentage={student.percentage} />
          <div className="detail-stat" style={{ marginTop: 8 }}>
            <span className="detail-stat-label">Present</span>
            <span className="detail-stat-value">{student.totalPresent}</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-label">Absent</span>
            <span className="detail-stat-value">{student.totalAbsent}</span>
          </div>
        </div>
      </div>

      {/* Attendance log */}
      {student.attendanceHistory && student.attendanceHistory.length > 0 ? (
        <div className="panel">
          <div className="panel-header">
            <h2>Recent Attendance Log</h2>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Semester</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {student.attendanceHistory.map((log) => (
                  <tr key={log._id} style={{ cursor: 'default' }}>
                    <td>{log.date}</td>
                    <td>Semester {log.semester}</td>
                    <td>
                      <span className={`badge ${log.type === 'present' ? 'badge-excellent' : 'badge-critical'}`}>
                        <span className="badge-dot" />
                        {log.type === 'present' ? 'Present' : 'Absent'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="panel">
          <div className="panel-header"><h2>Attendance Log</h2></div>
          <div className="history-empty">
            No attendance records yet. Use &ldquo;Mark Attendance&rdquo; to start tracking.
          </div>
        </div>
      )}
    </div>
  );
}
