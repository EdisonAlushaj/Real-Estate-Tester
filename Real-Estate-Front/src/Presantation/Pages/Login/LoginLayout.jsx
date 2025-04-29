import React from 'react';
import { Outlet } from 'react-router-dom';

const LoginLayout = () => (
  <div className="login-layout">
    <Outlet />  {/* Renders only the Login component */}
  </div>
);

export default LoginLayout;