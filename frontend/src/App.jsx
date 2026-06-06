import { useState } from "react";

import Login from "./pages/Login";
import RiderDashboard from "./pages/RiderDashboard";
import CaptainDashboard from "./pages/CaptainDashboard";

function App() {

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  if (!loggedIn) {
    return <Login setLoggedIn={setLoggedIn} />;
  }

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (user?.role === "captain") {
    return <CaptainDashboard />;
  }

  return <RiderDashboard />;
}

export default App;