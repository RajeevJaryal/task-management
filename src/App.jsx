import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import { loadCurrentUser } from "./store/authSlice";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChooseRole from "./pages/ChooseRole";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/choose-role"
          element={
            <ProtectedRoute>
              <ChooseRole />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute role>
              <Tasks />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}