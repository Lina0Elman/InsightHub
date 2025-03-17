import React, { useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {getUserAuth} from "../handlers/userAuth.ts";

const RequireAuth: React.FC<{ children: React.ReactNode }> = (props: any) => {
  const userAuthRef = useRef(getUserAuth());
  const location = useLocation();

  if (!userAuthRef.current) {
    return (
        <Navigate to={'/'} state={{ from: location }} replace />
    );
  }

  return props.children;
};

export default RequireAuth;