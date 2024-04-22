import React, { useState } from 'react';
import axios from 'axios';
import "./Login.css";

import { useNavigate, Link } from "react-router-dom";





const VerifyOTP = () => {

    const [formData, setFormData] = useState({
        user_otp: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = axios.post('https://healthmate-backend.onrender.com/api/verifyOTP', formData);
            console.log(response.data);
            alert('OTP Verified Successfully');
            navigate('/ResetPassword');

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
                <h1 className="h1_title margin_bottom">Verification</h1>
                <label>Enter the OTP:</label>
                <input
                    name="user_otp"
                    value={formData.user_otp}
                    onChange={handleChange}
                />
                <div className='Login_Buttons'>
                    <button className="in_center" type="submit">Submit</button>
                </div>

            </form>
        </div>

    )
}

export default VerifyOTP