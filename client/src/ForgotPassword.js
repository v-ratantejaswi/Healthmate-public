import React, { useState } from 'react';
import axios from 'axios';
import "./Login.css";

import { useNavigate, Link } from "react-router-dom";





const ForgotPassword = () => {

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
            const response = axios.post('https://healthmate-backend.onrender.com/api/checkValidEmail', formData);
            console.log(response.data);
            alert('Email address verified ! OTP sent on the registered email address.');
            navigate('/VerifyOTP');

        } catch (error) {
            console.error(error);
            alert('Error Sending OTP.');
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
                <label>Enter your registered email address:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <div className='Login_Buttons'>
                    <button className="in_center" type="submit">Send OTP</button>
                </div>

            </form>
        </div>

    )
}

export default ForgotPassword