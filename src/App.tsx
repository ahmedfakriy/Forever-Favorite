import { useState } from 'react';
import StoreFront from './components/StoreFront';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function handleOpenAdmin() {
    const authenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    if (authenticated) {
      setIsAuthenticated(true);
      setShowAdmin(true);
    } else {
      setShowLogin(true);
    }
  }

  function handleLogin() {
    setIsAuthenticated(true);
    setShowLogin(false);
    setShowAdmin(true);
  }

  function handleCloseAdmin() {
    setShowAdmin(false);
  }

  if (showLogin) {
    return <AdminLogin onLogin={handleLogin} onCancel={() => setShowLogin(false)} />;
  }

  return showAdmin ? (
    <AdminDashboard onClose={handleCloseAdmin} />
  ) : (
    <StoreFront onOpenAdmin={handleOpenAdmin} />
  );
}

export default App;
