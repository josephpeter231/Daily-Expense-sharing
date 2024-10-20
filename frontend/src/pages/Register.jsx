import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './Register.css'; // Import custom CSS for additional styling

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    axios.post('http://localhost:5000/register', { name, email, mobile, password })
      .then(() => {
        alert('User registered successfully');
        window.location.href = '/'; 
      })
      .catch(() => alert('Error registering user'));
  };
  
  return (
    <div className="register-container">
      <div className="card register-card">
        <h1 className="text-center mb-4">Register</h1>
        <div className="form-group">
          <input 
            type="text" 
            className="form-control mb-3" 
            placeholder="Name" 
            onChange={(e) => setName(e.target.value)} 
          />
          <input 
            type="email" 
            className="form-control mb-3" 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="text" 
            className="form-control mb-3" 
            placeholder="Mobile" 
            onChange={(e) => setMobile(e.target.value)} 
          />
          <input 
            type="password" 
            className="form-control mb-3" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button 
            className="btn btn-primary btn-block" 
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
        <div className="text-center mt-3">
          <p>
            Already have an account? 
            <Link to="/" className="ml-1">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
