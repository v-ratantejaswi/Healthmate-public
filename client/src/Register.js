


import React, { useState } from "react";
import "./Register.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cpassword: '',
    type: '',
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    type: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    setFormErrors({
      email: name === 'email' && !value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? 'Invalid email format' : '',
      password: name === 'password' && value.length < 8 ? 'Password must be at least 8 characters long' : '',
      cpassword: name === 'cpassword' && value !== formValues.password ? 'Passwords do not match' : '',
      type: name === 'type' && value === '' ? 'Please select a user type' : '',
    });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://healthmate-backend.onrender.com/api/register', formValues);
      alert('User registered successfully.');
      navigate('/Login'); // Navigate to the homepage after successful registration
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400 && error.response.data === 'User already exists.') {
        alert('User with this email already exists. Please use a different email address.');
      } else {
        alert('Error registering the user.');
      }

    }
  };

  return (
    <div className="register-background">
      <div className="app">
        <header className="header">
          <Link to="/">
            <div className="logo">Healthmate</div>
          </Link>
        </header>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <h1 className="h1_title">Register</h1>
        <br></br>
        <label htmlFor="fname">First Name</label>
        <input className="reg_input"
          value={formValues.firstName}
          onChange={handleChange}
          type="text"
          placeholder="First Name"
          id="fname"
          name="firstName"
          required
        />

        <label htmlFor="lname">Last Name</label>
        <input className="reg_input"
          value={formValues.lastName}
          onChange={handleChange}
          type="text"
          placeholder="Last Name"
          id="lname"
          name="lastName"
          required
        />

        <label htmlFor="email">Email Id</label>
        <input className="reg_input"
          value={formValues.email}
          onChange={handleChange}
          type="email"
          placeholder="Email Id"
          id="email"
          name="email"
          required
        />
        {formErrors.email && <p>{formErrors.email}</p>}

        <label htmlFor="password">Password</label>
        <input className="reg_input"
          value={formValues.password}
          onChange={handleChange}
          type="password"
          placeholder="********"
          id="password"
          name="password"
          required
        />
        {formErrors.password && <p>{formErrors.password}</p>}

        <label htmlFor="cpassword">Confirm Password</label>
        <input className="reg_input"
          value={formValues.cpassword}
          onChange={handleChange}
          type="password"
          placeholder="********"
          id="cpassword"
          name="cpassword"
          required
        />

        {formErrors.cpassword && <p>{formErrors.cpassword}</p>}

        <label htmlFor="type">User Type</label>
        <select
          className="reg_input"
          value={formValues.type}
          onChange={handleChange}
          id="type"
          name="type"
          required
        >
          <option value="">Select User Type</option>
          <option value="client">Client</option>
          <option value="fitness-professional">Fitness Professional</option>
        </select>
        {formErrors.type && <p>{formErrors.type}</p>}
        <br></br>
        <button type="submit">Register</button>
        <br></br>
        <Link to="/Login">
          <button >Already a User? Login!</button>
        </Link>
        <br></br>
        ------------------OR------------------
        <br></br>
        <a href="https://healthmate-backend.onrender.com/api/auth/google" >Sign in with Google</a>

      </form>


    </div>
  );
}

export default Register;

