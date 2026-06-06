import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import RiderDashboard from "./pages/RiderDashboard";
import CaptainDashboard from "./pages/CaptainDashboard";

import ProtectedRoute from "./ProtectedRoute";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/rider"
          element={
            <ProtectedRoute allowedRole="rider">
              <RiderDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/captain"
          element={
            <ProtectedRoute allowedRole="captain">
              <CaptainDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/login" />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;