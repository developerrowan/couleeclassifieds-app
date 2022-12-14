import { Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import RequireAuthentication from './components/RequireAuthentication';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Logout from './components/Logout';
import { AuthContext } from './hooks/auth.hook';
import { useEffect, useState } from 'react';
import { getUser, isUserEmployer } from './services/auth.service';
import Home from './pages/Home';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import Users from './pages/admin/Users';
import User from './pages/admin/User';
import Roles from './pages/admin/Roles';
import Role from './pages/admin/Role';
import About from './pages/About';

function App() {
  const [user, setUser] = useState(null);
  const [isEmployer, setIsEmployer] = useState(false);

  useEffect(() => {
    const user = getUser();
    setUser(user);
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ user, setUser, isEmployer, setIsEmployer }}>
        <Navbar />
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route
            path="/profile"
            element={
              <RequireAuthentication redirect="profile">
                <UserProfile />
              </RequireAuthentication>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/admin/users"
            element={
              <RequireAuthentication roleLevel={3} redirect="admin/users">
                <Users />
              </RequireAuthentication>
            }
          />
          <Route
            path="/admin/users/:userId"
            element={
              <RequireAuthentication roleLevel={3} redirect="/admin/users">
                <User />
              </RequireAuthentication>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <RequireAuthentication roleLevel={3} redirect="admin/roles">
                <Roles />
              </RequireAuthentication>
            }
          />
          <Route
            path="/admin/roles/:roleId"
            element={
              <RequireAuthentication roleLevel={3} redirect="/admin/roles">
                <Role />
              </RequireAuthentication>
            }
          />
        </Routes>
      </AuthContext.Provider>
    </>
  );
}

export default App;
