


// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from "react-router-dom";

// const ClientDashboard = () => {
//   const [user, setUser] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const userType = localStorage.getItem('type');
//     const userId = localStorage.getItem('id');
//     const token = localStorage.getItem('token');

//     fetch(`https://healthmate-backend.onrender.com/api/users/${userType}/${userId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         setUser(data);
//       })
//       .catch(error => {
//         console.error('Error fetching user details:', error.message);
//       });
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <div>
//       {user && (
        
//         <div>
//         <header className="header">
//         <div className="logo">Healthmate</div>
//         <nav>
//           <ul className="nav-list">
//           <li>
//               <button className="nav-button" onClick={handleLogout}>
//                 Logout
//               </button>
//           </li>
//           <li>
//             <Link to="/Posts">
//               <button className="nav-button" >
//                 Posts
//               </button>
//               </Link>
//           </li>
//           <li>
//             <Link to="/Profile">
//               <button className="nav-button" >
//                 Profile
//               </button>
//             </Link>  
//           </li>
//           <li>
//             <Link to="/fpList">
//               <button className="nav-button" >
//                 Fitness Professionals
//               </button>
//             </Link>  
//           </li>
          
//           </ul>
//         </nav>
//       </header>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <div>
//             <h1>This is client dashboard page</h1>
//           <h1>Welcome, {user.firstName} {user.lastName}!</h1>
//           <p>Email: {user.email}</p>
//           <p>User Type: {user.type}</p>
//         </div>

//         </div>
//       )}
//     </div>
    

    
//   );
// };

// export default ClientDashboard;


// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from "react-router-dom";

// const ClientDashboard = () => {
//   const [user, setUser] = useState(null);
//   const [recommendations, setRecommendations] = useState([]);
//   const [allPosts, setAllPosts] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const userType = localStorage.getItem('type');
//     const userId = localStorage.getItem('id');
//     const token = localStorage.getItem('token');

//     const fetchUserDetails = async () => {
//       try {
//         const response = await fetch(`https://healthmate-backend.onrender.com/api/users/${userType}/${userId}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });
    
//         if (!response.ok) {
//           throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
//         }
    
//         const userData = await response.json();
//         setUser(userData);
    
//         const recommendationsResponse = await fetch(`https://healthmate-backend.onrender.com/api/users/${userId}/recommendations`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });
    
//         if (!recommendationsResponse.ok) {
//           throw new Error(`HTTP error ${recommendationsResponse.status}: ${recommendationsResponse.statusText}`);
//         }
    
//         const recommendationsData = await recommendationsResponse.json();
//         setRecommendations(recommendationsData);
//       } catch (error) {
//         console.error('Error fetching user details and recommendations:', error.message);
//       }
//     };
    

//     // const fetchUserDetails = async () => {
//     //   try {
//     //     const response = await fetch(`https://healthmate-backend.onrender.com/api/users/${userType}/${userId}`, {
//     //       headers: {
//     //         'Authorization': `Bearer ${token}`,
//     //       },
//     //     });

//     //     if (!response.ok) {
//     //       throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
//     //     }

//     //     const userData = await response.json();
//     //     setUser(userData);

//     //     const postsResponse = await fetch('https://healthmate-backend.onrender.com/api/posts', {
//     //       headers: {
//     //         'Authorization': `Bearer ${token}`,
//     //       },
//     //     });

//     //     if (!postsResponse.ok) {
//     //       throw new Error(`HTTP error ${postsResponse.status}: ${postsResponse.statusText}`);
//     //     }

//     //     const allPostsData = await postsResponse.json();
//     //     setAllPosts(allPostsData);
//     //   } catch (error) {
//     //     console.error('Error fetching user details and posts:', error.message);
//     //   }
//     // };

//     fetchUserDetails();
//   }, []);

//   useEffect(() => {
//     if (user && allPosts.length > 0) {
//       const subscribedIds = user.subscribed.map(professional => professional._id);
//       const filteredPosts = allPosts.filter(post => subscribedIds.includes(post.authorId));
//       setRecommendations(filteredPosts);
//     }
//   }, [user, allPosts]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <div>
//       {user && (
//         <div>
//           {user && (
        
//                 <div>
//                 <header className="header">
//                 <div className="logo">Healthmate</div>
//                 <nav>
//                   <ul className="nav-list">
//                   <li>
//                       <button className="nav-button" onClick={handleLogout}>
//                         Logout
//                       </button>
//                   </li>
//                   <li>
//                     <Link to="/Posts">
//                       <button className="nav-button" >
//                         Posts
//                       </button>
//                       </Link>
//                   </li>
//                   <li>
//                     <Link to="/Profile">
//                       <button className="nav-button" >
//                         Profile
//                       </button>
//                     </Link>  
//                   </li>
//                   <li>
//                     <Link to="/fpList">
//                       <button className="nav-button" >
//                         Fitness Professionals
//                       </button>
//                     </Link>  
//                   </li>
                  
//                   </ul>
//                 </nav>
//               </header>
//               <br></br>
//               <br></br>
//               <br></br>
//               <br></br>
//               <br></br>
//               <div>
//                     <h1>This is client dashboard page</h1>
//                   <h1>Welcome, {user.firstName} {user.lastName}!</h1>
//                   <p>Email: {user.email}</p>
//                   <p>User Type: {user.type}</p>
//                 </div>
        
//                 </div>
//               )}
          
//           <div>
//             <h2>Recommendations</h2>
//             <ul>
//               {recommendations.map((post, index) => (
//                 <li key={index}>
//                   <h3>{post.title}</h3>
//                   <p>{post.description}</p>
//                   <Link to={`/post/${post._id}`}>View Post</Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClientDashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import './Clientdashboard.css';

const ClientDashboard = () => {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsError, setRecommendationsError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('type');
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    console.log("User ID:", userId); 

    const fetchUserDetailsAndRecommendations = async () => {
      try {
        console.log("user Id for recommendations", userId);
        const response = await axios.get(`https://healthmate-backend.onrender.com/api/users/${userType}/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const userData = response.data;
        setUser(userData);
        console.log("User data", userData);

        try {
          console.log("userId in recommendations in client side", userId);
          const recommendationsResponse = await axios.get(`https://healthmate-backend.onrender.com/api/users_rec/${userId}/recommendations`, {
      
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          console.log("Recommendations", recommendationsResponse);
          if (recommendationsResponse.status !== 200) {
            throw new Error(`HTTP error ${recommendationsResponse.status}: ${await recommendationsResponse.text()}`);
          }

          const recommendationsData = recommendationsResponse.data;
          setRecommendations(recommendationsData);
        } catch (error) {
          console.error('Error fetching recommendations:', error.message, error.response);
          setRecommendationsError(error.message);
        }

      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    fetchUserDetailsAndRecommendations();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="client-dashboard">
      {user && (
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
                      <Link to="/Chat_list">
                        <button className="nav-button">
                          Chat
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Posts">
                        <button className="nav-button">
                          Posts
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
                      <Link to="/fpList">
                        <button className="nav-button">
                          Fitness Professionals
                        </button>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </header>
              <div className="client-dashboard-content">
                <h1>Welcome, {user.firstName} {user.lastName}!</h1>
                {/* <p>Email: {user.email}</p> */}
                {/* <p>User Type: {user.type}</p> */}
              </div>
            </div>
          )}
          <div className="recommendations">
            <h2>Recommendations</h2>
            <div className="recommendations-container">
              <ul className="recommendations-list">
                {recommendations.map((post, index) => (
                  <li key={index} className="recommendation-item">
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    <Link to={`/post/${post._id}`}>View Post</Link>
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

export default ClientDashboard;