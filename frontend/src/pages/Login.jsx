import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // ==========================================
  // COMMON LOGIN FUNCTION
  // ==========================================

  const loginUser = async (emailValue, passwordValue) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: emailValue,
          password: passwordValue,
        }
      );

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

      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  // ==========================================
  // NORMAL LOGIN
  // ==========================================

  const handleLogin = () => {
    loginUser(email, password);
  };

  // ==========================================
  // GUEST RIDER LOGIN
  // ==========================================

  const handleGuestRider = () => {
    loginUser(
      "rider@smartride.com",
      "123456"
    );
  };

  // ==========================================
  // GUEST CAPTAIN LOGIN
  // ==========================================

  const handleGuestCaptain = () => {
    loginUser(
      "captain@smartride.com",
      "123456"
    );
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>🚖 SmartRide AI</h1>

        <h2>
          AI-Assisted Smart Ride Dispatch
          System
        </h2>

        <p>
          Login to continue your journey.
        </p>

        <input
          type="email"
          placeholder="📧 Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />

        <input
          type="password"
          placeholder="🔒 Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />

        {/* LOGIN */}

        <button
          className="primary-btn"
          onClick={handleLogin}
        >
          🚀 Login
        </button>

        <br />
        <br />

        {/* GUEST RIDER */}

        <button
          className="secondary-btn"
          onClick={handleGuestRider}
        >
          🚖 Guest Rider Login
        </button>

        <br />
        <br />

        {/* GUEST CAPTAIN */}

        <button
          className="secondary-btn"
          onClick={handleGuestCaptain}
        >
          🚗 Guest Captain Login
        </button>

        <br />
        <br />

        {/* DEMO CREDENTIALS */}

        <div className="demo-box">

          <h3>Demo Accounts</h3>

          <p>
            <strong>Rider</strong>
            <br />
            rider@smartride.com
            <br />
            Password: 123456
          </p>

          <hr />

          <p>
            <strong>Captain</strong>
            <br />
            captain@smartride.com
            <br />
            Password: 123456
          </p>

        </div>

        <br />

        {/* REGISTER */}

        <p>
          Don't have an account?
        </p>

        <button
          className="primary-btn"
          onClick={() =>
            navigate("/register")
          }
        >
          📝 Register
        </button>

        <div className="login-footer">
          SmartRide AI © 2026
        </div>

      </div>

    </div>
  );
}

export default Login;