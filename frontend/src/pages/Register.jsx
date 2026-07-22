import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("rider");

  const navigate = useNavigate();

  const handleRegister = async () => {

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {

      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      alert("Registration Successful");

      navigate("/login");

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );

    }

  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>🚖 SmartRide AI</h1>

        <h2>Create Your Account</h2>

        <p>
          Register as a Rider or Captain
        </p>

        <input
          type="text"
          placeholder="👤 Full Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

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

        <select
          value={role}
          onChange={(e)=>setRole(e.target.value)}
        >

          <option value="rider">
            🚖 Rider
          </option>

          <option value="captain">
            🚗 Captain
          </option>

        </select>

        <button
          className="primary-btn"
          onClick={handleRegister}
        >
          📝 Register
        </button>

        <br />
        <br />

        <button
          className="secondary-btn"
          onClick={() => navigate("/login")}
        >
          🔑 Back to Login
        </button>

        <div className="login-footer">

          SmartRide AI © 2026

        </div>

      </div>

    </div>

  );

}

export default Register;