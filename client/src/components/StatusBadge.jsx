export default function StatusBadge({ percentage }) {
  let cls, label;

  if (percentage >= 90) {
    cls = 'badge-excellent';
    label = 'Excellent';
  } else if (percentage >= 75) {
    cls = 'badge-average';
    label = 'Average';
  } else {
    cls = 'badge-critical';
    label = 'At Risk';
  }

  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" />
      {label}
    </span>
  );
}
