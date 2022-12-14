import React, { FC, useEffect } from 'react';
import { getToken, getUser, logout, verify } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

export default function RequireAuthentication(props: any) {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();
  const roleLevel = props.roleLevel;

  useEffect(() => {
    if (user === null || (token === null && roleLevel && roleLevel !== -1)) {
      navigate(`/login?next=${props.redirect}`);
    } else {
      const isValidToken = async () => {
        const result = await verify(props.roleLevel);
        if (result === 401) {
          logout();
          navigate(
            `/login?next=${props.redirect}&dangerMessage=${encodeURIComponent(
              'Your session has expired. Please sign back in using your credentials.'
            )}`
          );
        } else if (result === 403) {
          navigate(
            `/?dangerMessage=${encodeURIComponent(
              'You do not have permission to access this resource. If this is a mistake, please reach out to the system administrator.'
            )}`
          );
        }
      };

      isValidToken();
    }
  }, []);

  return <>{token !== null || !roleLevel || roleLevel === -1 ? props.children : null}</>;
}
