import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import './Chat_list.css';
import UserChat from './UserChat';


const ChatList = () => {
  const [professionals, setProfessionals] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [selectedProfessionalEmail, setSelectedProfessionalEmail] = useState(null);
  const userId = localStorage.getItem('id');
  const [userEmail, setUserEmail] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get(`https://healthmate-backend.onrender.com/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    if (userId && token) {
      fetchUserEmail();
    }
  }, [userId, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://healthmate-backend.onrender.com/api/fp_list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setProfessionals(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleClick = (professionalId, professionalEmail) => {
    setSelectedProfessional(professionalId);
    setSelectedProfessionalEmail(professionalEmail);
  };

  return (<div>
    <header className="header">
      <div className="logo">Healthmate</div>
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/ClientDashboard">
              <button className="nav-button">
                Go Back
              </button>
            </Link>
          </li>
          <li>
            <Link to="/Profile">
              <button className="nav-button">
                Profile
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
    <br></br>
    <br></br>
    <br></br>
    <div className="chat-list">
      <h1>Available Fitness Professionals</h1>
      <div className="professionals-container">
        {professionals.map((professional) => (
          <div
            key={professional._id}
            className="professional-box"
            onClick={() => handleClick(professional._id, professional.email)}
          >
            <p>
              {professional.firstName} {professional.lastName}
            </p>
            <p>{professional.email}</p>
          </div>
        ))}
      </div>
      {selectedProfessional && userEmail && (
        <UserChat
          userEmail={userEmail}
          professionalId={selectedProfessional}
          professionalEmail={selectedProfessionalEmail}
        />
      )}
    </div>
  </div>
  );
};

export default ChatList;
