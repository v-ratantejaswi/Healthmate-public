import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './NewPost.css';

const NewPost = ({ location }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handle_Dashboard = () => {
    window.history.back();
  }


  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('workout');
  useEffect(() => {
    const userType = localStorage.getItem('type');
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    setToken(token)
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
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://healthmate-backend.onrender.com/api/newpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Make sure to add this line
        },
        body: JSON.stringify({
          title,
          description,
          type,
          email: user.email,
          userName: user.name,
        }),
      });

      if (response.ok) {
        alert('Data submitted successfully.');
        navigate('/FPDashboard');
      } else {
        alert('Error submitting data.');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting data.');
    }
  };

  return (
    <div className="newpost-background">
      <div>
        <header className="header">
          <div className="logo">Healthmate</div>
          <nav>
            <ul className="nav-list">
              <li>
                <Link to="/Posts">
                  <button className="nav-button" >
                    Posts
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/ClientDashboard">
                  <button className="nav-button" onClick={handle_Dashboard}>
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
              <li>
                <button className="nav-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>


            </ul>
          </nav>
        </header>
        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="h1_title">New Post</h1>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label>Type:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="workout">Workout</option>
              <option value="diet">Diet</option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default NewPost;