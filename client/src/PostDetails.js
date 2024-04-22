import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PostReviews from './PostReviews';
import "./PostDetails.css";
import { Link } from "react-router-dom";

const PostDetails = () => {

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handle_Dashboard = () =>{
    window.history.back();
  }

  const [post, setPost] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);


  const userType = localStorage.getItem('type');
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://healthmate-backend.onrender.com/api/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        setPost(response.data);
        setReviews(response.data.reviews || []);

      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();

  }, [id]);





  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.get(`https://healthmate-backend.onrender.com/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const { firstName, lastName, email } = response.data;
      const fullName = firstName + lastName
      await axios.post(`https://healthmate-backend.onrender.com/api/posts/${id}/reviews`, {
        userId,
        userType,
        rating,
        review,
        fullName,
        email
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setRating('');
      setReview('');
      navigate('/posts'); // Replace `history.push('/posts')` with `navigate('/posts')`
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (

    <div><header className="header">
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

      </ul>
    </nav>
  </header>

    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: "center" }}>

          <br></br>
          <br></br>
          <label>Rating:</label>
          <div className="rating">
            {[...Array(5)].map((star, i) => {
              const ratingValue = i + 1;
              return (
                <label key={i}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    hidden
                    checked={ratingValue === rating}
                    onChange={() => setRating(ratingValue)}
                  />
                  <span
                    className={`star ${ratingValue <= rating ? "filled" : ""}`}
                    onClick={() => setRating(ratingValue)}
                  ></span>
                </label>
              );
            })}
          </div>
        </div>

        <br></br>
        <br></br>
        <div style={{ textAlign: "center" }}>
          <label>Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            style={{ width: "500px", height: "100px" }}
          ></textarea>

          <br></br>
          <br></br>
          <button type="submit">Submit</button>
        </div>

        <PostReviews reviews={reviews} />
      </form>
    </div>
    </div>
  );
};

export default PostDetails;


