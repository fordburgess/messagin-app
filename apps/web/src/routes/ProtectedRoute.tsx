import { useAuthContext } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) {
    return <p>Loading...</p>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

export default ProtectedRoute
