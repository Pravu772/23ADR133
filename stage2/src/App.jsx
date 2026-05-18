import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import AllNotifications from './pages/AllNotifications';
import PriorityNotifications from './pages/PriorityNotifications';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Campus Notifications</h1>
        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            All
          </NavLink>
          <NavLink to="/priority" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Priority
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<AllNotifications />} />
          <Route path="/priority" element={<PriorityNotifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
