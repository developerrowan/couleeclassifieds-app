import { useEffect, useState } from 'react';
import { createContext, useContext } from 'react';
import { getUser, verify } from '../services/auth.service';

export const AuthContext = createContext({
  user: null,
  setUser: (data?: any) => {},
  isEmployer: false,
  setIsEmployer: (data: boolean) => {}
});

export const useAuth = () => useContext(AuthContext);
