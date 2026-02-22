import { Navigate } from "react-router-dom";
import { isTokenValid } from "../api/tokenValidation";

export default function ProtectedRoute({ children }) {
  
  if (!isTokenValid()) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }


  return children;
}
