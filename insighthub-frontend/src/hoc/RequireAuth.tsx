import React, { useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { config } from '../config';
import { LoginResponse } from '../models/LoginResponse';

const RequireAuth: React.FC<{ children: React.ReactNode }> = (props: any) => {
  const userAuthRef = useRef(JSON.parse(localStorage.getItem(config.localStorageKeys.userAuth) as string) as LoginResponse);
  const location = useLocation();

  if (!userAuthRef.current) {
    return (
        <Navigate to={'/'} state={{ from: location }} replace />
    );
  }

  return props.children;
};

export default RequireAuth;