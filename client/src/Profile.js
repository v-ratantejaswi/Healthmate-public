import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Profile.css";


const Profile = () => {


  const [user, setUser] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    const userType = localStorage.getItem('type');
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    fetch(`https://healthmate-backend.onrender.com/api/users/${userType}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
      })
      .catch(error => {
        console.error('Error fetching user details:', error.message);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handle_Dashboard = () =>{
    window.history.back();
  }

  const handleSaveChanges = (event) => {
    event.preventDefault();
    try {
      axios.post('https://healthmate-backend.onrender.com/api/updateProfile', user);
      alert('Details Updated Successfully.');
      navigate('/ClientDashboard');
    } catch (error) {
      console.error(error);
      setIsEditing(false);

    }

  };

  const toggleEdit = () => {
    setIsEditing(prevIsEditing => !prevIsEditing);
  };

  const handleCancel = () => {
    navigate('/ClientDashboard');
    setIsEditing(false);
  };


  return (

    <div>
      {user && (

        <div>
          <header className="header">
            <div className="logo">Healthmate</div>
            <nav>
              <ul className="nav-list">
                <li>
                  <button className="nav-button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
                <li>
                  <Link to="/Posts">
                    <button className="nav-button" >
                      Posts
                    </button>
                  </Link>
                </li>
                <li>
                    <button className="nav-button" onClick={handle_Dashboard}>
                      Go Back
                    </button>
                </li>

              </ul>
            </nav>
          </header>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <div className="profile-page">
            <h1 className="profile-page__title">User Profile</h1>
            {!isEditing && (
              <>
                <p className="profile-page__info">First Name: {user.firstName}</p>
                <p className="profile-page__info">Last Name: {user.lastName}</p>
                <p className="profile-page__info">Email: {user.email}</p>
                <p className="profile-page__info">User Type: {user.type}</p>
                <button className="profile-page__button" onClick={toggleEdit}>
                  Edit
                </button>
                <br></br>
                <button className="profile-page__button" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            )}
            {isEditing && (
              <form onSubmit={handleSaveChanges}>
                <label className="profile-page__label" htmlFor="firstName">
                  First Name:
                </label>
                <input
                  className="profile-page__input"
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleInputChange}
                />
                <br />
                <br />
                <label className="profile-page__label" htmlFor="lastName">
                  Last Name:
                </label>
                <input
                  className="profile-page__input"
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleInputChange}
                />
                <br />
                <br />
                <button className="profile-page__button" type="submit">
                  Save Changes
                </button>
                <button
                  className="profile__button--cancel profile-page__button"
                  type="button"
                  onClick={toggleEdit}
                >
                  Discard Changes
                </button>
              </form>
            )}
          </div>



        </div>
      )}
    </div>)
}

export default Profile

