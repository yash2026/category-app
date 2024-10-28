import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function ProtectedRoute({ component: Component }) {
  const { currentUser, isVerified } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  if (!isVerified) {
    return <Navigate to="/verify" />;
  }
  return <Component />;
}

export default ProtectedRoute;
