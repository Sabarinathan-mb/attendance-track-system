import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getStudents, getSummary } from '../services/api';
import SummaryCards from '../components/SummaryCards';
import StudentTable from '../components/StudentTable';
import AddStudentForm from '../components/AddStudentForm';

export default function DashboardPage() {
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [studentsData, summaryData] = await Promise.all([
        getStudents(),
        getSummary(),
      ]);
      setStudents(studentsData);
      setSummary(summaryData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Show toast from navigation state (e.g. after marking attendance)
  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      // Clear navigation state so toast doesn't re-show on refresh
      window.history.replaceState({}, '');
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  if (error && !students.length) {
    return (
      <div className="app-layout">
        <div className="state-box">
          <p className="error-text">{error}</p>
          <button className="btn btn-ghost" onClick={() => { setLoading(true); setError(null); loadData(); }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Class attendance overview — sorted lowest to highest.</p>
      </div>

      <SummaryCards summary={summary} loading={loading} />

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>All Students</h2>
            {summary && <p>{summary.totalStudents} enrolled</p>}
          </div>
        </div>

        <StudentTable students={students} loading={loading} />
        <AddStudentForm onStudentAdded={loadData} />
      </div>

      {toast && <div className="toast toast-success">{toast}</div>}
    </div>
  );
}
