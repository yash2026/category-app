// src/App.js
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Categories from "./components/Categories";
import Header from "./components/Header";
import Verify from "./components/Verify";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <div className="flex items-center justify-center h-4/5 ">
          <Routes>
            <Route path="/" element={<RedirectToLoginOrCategories />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/categories"
              element={<ProtectedRoute component={Categories} />}
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

// Helper component to handle redirection
function RedirectToLoginOrCategories() {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/categories" /> : <Navigate to="/login" />;
}

export default App;
