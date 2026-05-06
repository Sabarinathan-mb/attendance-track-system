export default function SummaryCards({ summary, loading }) {
  if (loading) {
    return (
      <div className="summary-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-label">Loading...</div>
            <div className="stat-card-value" style={{ opacity: 0.15 }}>—</div>
          </div>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="summary-grid">
      <div className="stat-card emerald">
        <div className="stat-card-label">Best Attendance</div>
        <div className="stat-card-value">
          {summary.highest ? `${summary.highest.percentage}%` : '—'}
        </div>
        <div className="stat-card-sub">
          {summary.highest ? summary.highest.name : 'No data'}
        </div>
      </div>

      <div className="stat-card rose">
        <div className="stat-card-label">Lowest Attendance</div>
        <div className="stat-card-value">
          {summary.lowest ? `${summary.lowest.percentage}%` : '—'}
        </div>
        <div className="stat-card-sub">
          {summary.lowest ? summary.lowest.name : 'No data'}
        </div>
      </div>

      <div className="stat-card accent">
        <div className="stat-card-label">Total Students</div>
        <div className="stat-card-value">{summary.totalStudents}</div>
        <div className="stat-card-sub">enrolled</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-label">Current Semester</div>
        <div className="stat-card-value">Sem {summary.currentSemester}</div>
        <div className="stat-card-sub">{summary.totalClassDays} max class days</div>
      </div>
    </div>
  );
}
