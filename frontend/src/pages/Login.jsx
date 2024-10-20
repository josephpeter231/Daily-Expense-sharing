import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './Login.css'; 

const Login = ({ setAuthToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    axios.post('http://localhost:5000/login', { email, password })
      .then((res) => {
        alert('Logged in successfully');
        localStorage.setItem('user', JSON.stringify(res.data));
        setAuthToken(res.data.token); 
        window.location.href = '/add-expense'; 
      })
      .catch(() => alert('Invalid credentials'));
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <h1 className="text-center mb-4">Login</h1>
        <div className="form-group">
          <input 
            type="email" 
            className="form-control mb-3" 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            className="form-control mb-3" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button 
            className="btn btn-primary btn-block" 
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
        <div className="text-center mt-3">
          <p>
            `Don't have an account? 
            <Link to="/register" className="ml-1">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  setAuthToken: PropTypes.func.isRequired,
};

export default Login;
