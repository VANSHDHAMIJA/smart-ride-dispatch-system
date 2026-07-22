import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password
        }
      );
      console.log(response.data);
      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login Successful");

      if (response.data.user.role === "rider") {
        navigate("/rider");
      } else {
        navigate("/captain");
      }

    } catch (error) {

      console.error(error);

      alert("Login Failed");

    }

  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>🚖 SmartRide AI</h1>

        <h2>AI-Assisted Smart Ride Dispatch System</h2>

        <p>

          Login to continue your journey.

        </p>

        <input

          type="email"

          placeholder="📧 Email"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

        />

        <input

          type="password"

          placeholder="🔒 Password"

          value={password}

          onChange={(e)=>setPassword(e.target.value)}

        />

        <button

          className="primary-btn"

          onClick={handleLogin}

        >

          🚀 Login

        </button>

        <div className="login-footer">

          SmartRide AI © 2026

        </div>

      </div>

    </div>

  );

}

export default Login;