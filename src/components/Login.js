import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/login', {
        usernameOrEmail,
        password
      });
      setMessage(response.data.message);

      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('username', response.data.username); 

      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username or Email:</label>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <div>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
};

export default Login;
