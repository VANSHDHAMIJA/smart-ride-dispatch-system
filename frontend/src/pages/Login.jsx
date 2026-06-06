import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setLoggedIn }) {

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

      localStorage.setItem(
  "token",
  response.data.token
);

localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

if (response.data.user.role === "rider") {
  navigate("/rider");
} else {
  navigate("/captain");
}

      alert("Login Successful");

      console.log(response.data);

    } catch (error) {

  console.error(error);

  console.log(error.response);

  alert("Login Failed");

}
  };

  return (
    <div>

      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>

    </div>
  );
}

export default Login;