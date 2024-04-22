import React, { useRef } from "react";
import './App.css';
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import './Contact.css';



function Contact() {

    return (
        <div className="contact-container">
            <header className="header">
                <div className="logo">Healthmate</div>
                <nav>
                    <ul className="nav-list">
                        <Link to="/">
                            <button className="nav-button">Homepage</button>
                        </Link>
                        <li>
                            <Link to="/Login">
                                <button className="nav-button">Login</button>
                            </Link>
                        </li>
                        <li>
                            <Link to="/Register">
                                <button className="nav-button">Register</button>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <div className="contact-content" style={{margin: '70px auto', textAlign: 'center'}}>
  <h1 className="contact-h">Contact Us</h1>
  <div className="contact-map">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3093.087594976744!2d-86.52548318494813!3d39.17272933827314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886c66c6e3fb15f3%3A0x5ff3f26dda5a28a!2sLuddy%20School%20of%20Informatics%2C%20Computing%2C%20and%20Engineering!5e0!3m2!1sen!2sus!4v1681281831790!5m2!1sen!2sus"
      width="800"
      height="300"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
  <div className="contact-form" style={{margin: '20px auto'}}>
    <form
            action="https://formspree.io/f/xwkjwnkn"
            method="POST">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required></textarea>
      </div>
      <button type="submit" className="contact-button">
        Send
      </button>
    </form>
  </div>
</div>
        </div>
    );


}

export default Contact;
