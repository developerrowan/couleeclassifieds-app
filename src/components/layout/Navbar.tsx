import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAuth } from '../../hooks/auth.hook';
import { getUser, getUserById, logout, verify } from '../../services/auth.service';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);

  const { user, setUser } = useAuth();

  useEffect(() => {
    const isValidToken = async () => {
      const result = await verify();
      if (result === 401 || result === 403) {
        logout();
        setUser(null);
      }

      const u = await getUserById(getUser().userId);

      if (u) {
        setFirstName(u.firstName);
      }

      const isAdmin = await verify(3);

      if (isAdmin === 200) {
        setIsUserAdmin(true);
      }
    };

    isValidToken();
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg  navbar-fixed navbar-dark bg-dark"
      aria-label="Main navigation"
    >
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Coulee Classifieds
        </NavLink>
        <button
          className="navbar-toggler p-0 border-0"
          type="button"
          id="navbarSideCollapse"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={clsx('navbar-collapse offcanvas-collapse', isOpen ? 'open' : '')}
          id="navbarsExampleDefault"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/jobs"
              >
                Job Search
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/about"
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/contact"
              >
                Contact
              </NavLink>
            </li>
            {user && isUserAdmin && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Administration
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <NavLink
                      className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                      to="/admin/users"
                    >
                      Users
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                      to="/admin/roles"
                    >
                      Roles
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}
          </ul>
          <div className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon="user" /> {firstName ? `Hello, ${firstName}!` : 'Hello'}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <NavLink
                      className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                      to="/profile"
                    >
                      Profile
                    </NavLink>
                  </li>
                  {user && true ? (
                    <li>
                      <NavLink
                        className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                        to="/postings"
                      >
                        My Jobs
                      </NavLink>
                    </li>
                  ) : (
                    <li>
                      <NavLink
                        className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                        to="/resume"
                      >
                        Applied Jobs
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <NavLink
                      className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                      to="/settings"
                    >
                      Settings
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item text-danger" to="/logout">
                      Logout
                    </NavLink>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <NavLink
                  to={`/login?next=${window.location.pathname}`}
                  className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}
                >
                  Login
                </NavLink>
                <NavLink
                  to={`/register?next=${window.location.pathname}`}
                  className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
