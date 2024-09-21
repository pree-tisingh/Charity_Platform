import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State to track login error
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Save the JWT token in localStorage
        
        // Check the user's role and navigate to the respective dashboard
        if (response.data.user.role === 'admin') {
          navigate("/admin/dashboard"); // Redirect to admin dashboard
        } else {
          navigate("/"); // Redirect to user dashboard
        }
      }
    } catch (error) {
      console.error("Login Error", error);
      setError("Invalid credentials. Please try again."); // Set error message for invalid login
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>} {/* Show error message */}
      </form>
    </div>
  );
};

export default Login;
