import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/Dashboard';
import StudentDetailPage from './pages/StudentDetail';
import MarkAttendancePage from './pages/MarkAttendance';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/student/:id" element={<StudentDetailPage />} />
        <Route path="/attendance" element={<MarkAttendancePage />} />
      </Routes>
    </BrowserRouter>
  );
}
