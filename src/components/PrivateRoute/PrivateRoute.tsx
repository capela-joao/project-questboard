import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/authContext";

const PrivateRoute = ({ children }: { children:any }) => {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
