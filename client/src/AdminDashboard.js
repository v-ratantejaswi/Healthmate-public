import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import './FPdashboard.css';
import axios from 'axios';

const AdminDashboard = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [token, setToken] = useState('');

    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleSearch = () => {
        fetchPosts(`?search=${searchQuery}`);
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
        fetchPosts();
    }, []);


    const fetchPosts = async (query = '') => {
        try {
            const response = await fetch(`https://healthmate-backend.onrender.com/api/posts_admin/${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }


            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error.message);
        }
    };

    function approvePost(postId) {
        axios.put(`https://healthmate-backend.onrender.com/api/posts_approve/${postId}`, { status: "approved" },{
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log(response.data); // log the updated post data
                // optionally update the local state or refresh the post list
                alert("Your changes have been saved!");

// after the OK button is clicked, refresh the page
window.location.reload();

            })
            .catch(error => {
                console.error(error); // handle the error
            });
    }

    function rejectPost(postId) {
        axios.put(`https://healthmate-backend.onrender.com/api/posts_reject/${postId}`, { status: "rejected" },{
            headers: {
                'Authorization': `Bearer ${token}`,
            },})
            .then(response => {
                console.log(response.data); // log the updated post data
                // optionally update the local state or refresh the post list
                alert("Your changes have been saved!");

                // after the OK button is clicked, refresh the page
                window.location.reload();
                
            })
            .catch(error => {
                console.error(error); // handle the error
            });
    }


    return (
        <div className="fp-dashboard">
            { (

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
                                <Link to="/Profile">

                                    <button className="nav-button" >
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
                    <br></br>
                    <br></br>
                    <div>
                        <header style={{ "margin-top": "-250px" }} className="navbar">
                            <h1 style={{ "margin-right": "20px" }}>Posts</h1>
                            <div className="searchBox">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="searchInput"
                                />
                                <button onClick={handleSearch}>Search</button>
                            </div>
                        </header>
                        <div className="postsContainer">
                            <ul>
                                {posts.map((post) => (
                                    <li key={post._id} className="postItem">
                                        <Link to={`/post/${post._id}`}>
                                            <h2>{post.title}</h2>
                                            <p>{post.description}</p>
                                            <p>Type: {post.type}</p>
                                            <p>Author: {post.name}</p>
                                            <p>Email: {post.email}</p>
                                            <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
                                        </Link>
                                        <div>
                                            <button onClick={() => approvePost(post._id)}>Approve</button>
                                            <button onClick={() => rejectPost(post._id)}>Reject</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                </div>
            )}
        </div>



    );
};

export default AdminDashboard;
