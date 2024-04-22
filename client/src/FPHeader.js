// import React from 'react';
// import { useNavigate, Link } from "react-router-dom";


// const FPHeader = (user) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <header className="header">
//       <div className="logo">Healthmate</div>
//       <nav>
//         <ul className="nav-list">
//           <li>
//             <button className="nav-button" onClick={handleLogout}>
//               Logout
//             </button>
//           </li>
//           <li>
//             <Link to="/ProfessionalChat">
//               <button className="nav-button">
//                 Chats
//               </button>
//             </Link>
//           </li>
//           <li>
//             <Link to="/Posts">
//               <button className="nav-button">
//                 Posts
//               </button>
//             </Link>
//           </li>
//           <li>
//             <Link to={{ pathname: "/newpost", state: { user: user, token: localStorage.getItem('token') } }}>
//               <button className="nav-button">
//                 New Post
//               </button>
//             </Link>
//           </li>
//           <li>
//             <Link to="/Profile">
//               <button className="nav-button">
//                 Profile
//               </button>
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </header>
//   );
// };

// export default FPHeader;
