import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth.hook';
import { logout } from '../services/auth.service';

export default function Logout() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    logout();
    setUser();
    navigate('/');
  });

  return <></>;
}
