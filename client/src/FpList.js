import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

import './fpList.css';
import axios from 'axios';
import "./Profile.css";

const FpList = () => {
  const [professionals, setProfessionals] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    const source = axios.CancelToken.source();
    try {
      const userResponse = await axios.get(`https://healthmate-backend.onrender.com/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cancelToken: source.token,
      });
      setUser(userResponse.data);

      const fpListResponse = await axios.get('https://healthmate-backend.onrender.com/api/fp_list', {
        cancelToken: source.token,
      });
      setProfessionals(fpListResponse.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error('Error fetching data:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token]);

  const subscribeToProfessional = async (professionalId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`https://healthmate-backend.onrender.com/api/subscribe/${professionalId}`,
        { userId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        console.log('Successfully subscribed to professional');
        try {
          await fetchData();
          window.location.reload();
          // Fetch the updated user data after subscribing
        } catch (error) {
          console.error('Error fetching updated data:', error);
        }
      } else {
        console.error('Error subscribing to professional:', response.statusText);
      }
    } catch (error) {
      console.error('Error subscribing to professional:', error);
      try {
        const errorJson = await error.response.data;
        console.error('Error data:', errorJson);
      } catch (parseError) {
        console.error('Unable to parse error JSON:', parseError);
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const unsubscribeFromProfessional = async (professionalId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://healthmate-backend.onrender.com/api/unsubscribe/${professionalId}`,
        { userId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Successfully unsubscribed from professional');
        try {
          await fetchData(); // Fetch the updated user data after unsubscribing
          window.location.reload();

        } catch (error) {
          console.error('Error fetching updated data:', error);
        }
      } else {
        console.error('Error unsubscribing from professional:', response.statusText);
      }
    } catch (error) {
      console.error('Error unsubscribing from professional:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const isSubscribed = (professionalId) => {
    if (!user) return false;
    return user.subscribed.some((professional) => professional._id === professionalId);
  };

  const handle_Dashboard = () =>{
    window.history.back();
  }


  return (<div>
    <header className="header">
            <div className="logo">Healthmate</div>
            <nav>
              <ul className="nav-list">
              <li>
                    <button className="nav-button" onClick={handle_Dashboard}>
                      Go Back
                    </button>
                </li>

                <li>
                  <button className="nav-button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
                <li>
                  <Link to="/ClientDashboard">
                    <button className="nav-button" >
                      Dashboard
                    </button>
                  </Link>
                </li>

              </ul>
            </nav>
          </header>
          <br></br>
          <br></br>
          <br></br>
          <div className="fitness-professionals">
  <h1>Fitness Professionals</h1>
  {isLoading && <p>Loading...</p>}
  <table className="professionals-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Subscribe</th>
    </tr>
  </thead>
  <tbody>
    {professionals.map((professional, index) => (
      <tr key={index}>
        <td>
          {professional.firstName} {professional.lastName}
        </td>
        <td>{professional.email}</td>
        <td>
          {isSubscribed(professional._id) ? (
            <>
              <button className="subscribed-button" disabled>
                Subscribed
              </button>
              <button
                className="unsubscribe-button"
                onClick={() => unsubscribeFromProfessional(professional._id)}
                disabled={isLoading}
              >
                Unsubscribe
              </button>
            </>
          ) : (
            <button
              className="subscribe-button"
              onClick={() => subscribeToProfessional(professional._id)}
              disabled={isLoading}
            >
              Subscribe
            </button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
  {user && user.subscribed.length === 0 && (
    <p>Please subscribe to give recommendations</p>
  )}
</div>

    </div>
  );
};

export default FpList;
