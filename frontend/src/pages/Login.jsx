import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = () => {
    axios.post('http://localhost:5000/login', { email, password })
      .then((res) => {
        alert('Logged in successfully');
        console.log(res.data)
        localStorage.setItem('user',JSON.stringify(res.data));
      })
      .catch(() => alert('Invalid credentials'));
  };

  return (
    <div>
      <h1>Login</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

Login.propTypes = {
  setAuthToken: PropTypes.func.isRequired,
};

export default Login;
