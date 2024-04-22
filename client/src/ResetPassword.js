import React, { useState } from 'react';
import axios from 'axios';
import "./Login.css";

import { useNavigate, Link } from "react-router-dom";





const ResetPassword = () => {

    const [formErrors, setFormErrors] = useState({
        password: '',
    });


    const [formData, setFormData] = useState({
        password: '',
        cpassword: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));
      
        setFormErrors({
          password: name === 'password' && value.length < 8 ? 'Password must be at least 8 characters long' : '',
          cpassword: name === 'cpassword' && value !== formData.password ? 'Passwords do not match' : '',
        });
      };
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = axios.post('https://healthmate-backend.onrender.com/api/resetPassword', formData);
            console.log(response.data);
            alert('Password has been reset successfully !');
            navigate('/Login');

        } catch (error) {
            console.error(error);
            alert('Error resetting password.');
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
                <h1 className="h1_title margin_bottom">Reset Password</h1>
                <label htmlFor="password">Password</label>
                <input className="reg_input"
                    value={formData.password}
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
                    value={formData.cpassword}
                    onChange={handleChange}
                    type="password"
                    placeholder="********"
                    id="cpassword"
                    name="cpassword"
                    required
                />
                {formErrors.cpassword && <p>{formErrors.cpassword}</p>}
                <div className='Login_Buttons'>
                    <button className="in_center" type="submit">Submit</button>
                </div>


            </form>
        </div>

    )
}

export default ResetPassword