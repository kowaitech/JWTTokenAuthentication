import React, { useState } from 'react'; 
import { login } from './auth';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import './Login.css'; 

const Login = () => {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [error, seterror] = useState('');
  const [success, setsuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(username, password);
      alert('Login successful');
      setusername('');
      setpassword('');
      setsuccess('Successfully Logged In');
      seterror('');
      navigate("/home");
    } catch (err) {
      console.log('Login Error', err);
      seterror('Login Failed');
      setsuccess('');
    }
  };

  const API_URL = "http://localhost:6100/";

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      const decoded = jwtDecode(googleToken);
      console.log("Google user:", decoded);

      const response = await axios.post(`${API_URL}google-login`, {
        token: googleToken,
      });

      const jwtToken = response.data.token;
      localStorage.setItem("token", jwtToken);

      alert("Login Successful with Google!");
      navigate("/home");
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Google Login Failed");
    }
  };

  const handleGoogleError = () => {
    alert("Google Login Failed!");
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <div className="login-container">
        <div className="login-card">
          <h2>Welcome Back 👋</h2>
          <p className="subtitle">Login to your account</p>

          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              placeholder="Enter your username"
              required
            />

            <label>Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <button type="submit">Login</button>

            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
          </form>

          <div className="divider">or</div>

          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={handleGoogleError} 
          />

          <p className="register-text">
            Don’t have an account? <Link to="/">Register</Link>
          </p>

          {/* <Link to="/" className="home-link">← Back to Home</Link> */}
        </div>
      </div>
    </>
  );
};

export default Login;
