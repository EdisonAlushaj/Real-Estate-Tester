import { Navigate, Outlet } from 'react-router-dom'
import cookieUtils from './cookieUtils'

const PrivateRoute = () => {
  const isAuthenticated = (cookieUtils.getUserRoleFromCookies() === 'Admin' || cookieUtils.getUserRoleFromCookies() === 'Agent');
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute