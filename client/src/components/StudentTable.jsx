import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

function PctBar({ percentage }) {
  const color =
    percentage >= 90 ? 'var(--emerald)' :
    percentage >= 75 ? 'var(--amber)'   :
    'var(--rose)';

  return (
    <div className="pct-wrapper">
      <span className="pct-num">{percentage}%</span>
      <div className="pct-bar-track">
        <div
          className="pct-bar-fill"
          style={{ width: `${percentage}%`, background: color }}
        />
      </div>
    </div>
  );
}

function HistorySparkline({ history }) {
  if (!history || history.length === 0) {
    return <span className="history-label" style={{ marginLeft: 0 }}>No Data</span>;
  }
  return (
    <div className="history-sparkline">
      {history.map((log, idx) => (
        <div
          key={idx}
          className={`history-dot ${log.type}`}
          title={`${log.date}: ${log.type}`}
        />
      ))}
      <span className="history-label">Last {history.length}</span>
    </div>
  );
}

export default function StudentTable({ students, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Loading students…</p>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="state-box">
        <p>No students found. Add one below to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Roll</th>
            <th>Recent History</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Attendance</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id} onClick={() => navigate(`/student/${s._id}`)}>
              <td className="table-name">{s.name}</td>
              <td className="table-roll">{s.roll}</td>
              <td><HistorySparkline history={s.recentHistory} /></td>
              <td className="table-num">{s.totalPresent}</td>
              <td className="table-num">{s.totalAbsent}</td>
              <td><PctBar percentage={s.percentage} /></td>
              <td><StatusBadge percentage={s.percentage} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
