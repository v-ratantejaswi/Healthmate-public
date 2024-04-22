import React, { useState } from 'react';
import axios from 'axios';
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://healthmate-backend.onrender.com/api/login', formData);
      console.log(response.data);
      localStorage.clear();
      localStorage.setItem('token', response.data.token);
      alert('Login successfully done.');
      localStorage.setItem('type', response.data.user.type);
      localStorage.setItem('id', response.data.user.id);
      console.log(localStorage);
  
      // Redirect to the desired page based on user type
      switch (response.data.user.type) {
        case 'client':
          navigate('/ClientDashboard');
          break;
        case 'fitness-professional':
          navigate('/FPDashboard');
          break;
        case 'admin':
          navigate('/AdminDashboard');
          break;
        default:
          alert('Error: Unknown user type.');
      }
    } catch (error) {
      console.error(error);
      alert('Error Logging in.');
    }
  };
  



  
    return (
    <div className="login-background">
      <div className="app">
        <header className="header">
          <Link to="/">
            <div className="logo">Healthmate</div>
          </Link> 
        </header>
    </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="h1_title margin_bottom">Login</h1>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
      
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className='Login_Buttons'>
          <button type="submit">Login</button>  <Link to="/ForgotPassword">Forgot Password?</Link>

          <br></br>
          <Link to="/Register">
          <button>Not a User? Register!</button>
          </Link>
          </div>
        </form>
    </div>
      );
      
  
};

export default Login;


