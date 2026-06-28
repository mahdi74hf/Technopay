import React from 'react';
import { useApp } from './store';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Drawer from './components/Drawer';
import Dashboard from './components/pages/Dashboard';
import Reports from './components/pages/Reports';
import Settlements from './components/pages/Settlements';
import Profile from './components/pages/Profile';
import Access from './components/pages/Access';

const App: React.FC = () => {
  const { s } = useApp();

  if (s.screen === 'login') return <Login />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', direction: 'rtl' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <main style={{ flex: 1, padding: '24px 26px 40px', overflowX: 'hidden' }}>
          {s.nav === 'dashboard' && <Dashboard />}
          {s.nav === 'reports' && <Reports />}
          {s.nav === 'settlements' && <Settlements />}
          {s.nav === 'profile' && <Profile />}
          {s.nav === 'access' && <Access />}
        </main>
      </div>
      <Drawer />
    </div>
  );
};

export default App;
