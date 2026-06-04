import { useState } from "react";
import Login from "./pages/Login";
import RiderDashboard from "./pages/RiderDashboard";

function App() {

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  if (loggedIn) {
    return <RiderDashboard />;
  }

  return <Login setLoggedIn={setLoggedIn} />;
}

export default App;