// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './ProfessionalChat.css';
// import Chat from './Chat';

// const ProfessionalChat = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedUserEmail, setSelectedUserEmail] = useState(null);
//   const professionalId = localStorage.getItem('id');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get(`https://healthmate-backend.onrender.com/api/professional/chat/users/${professionalId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       console.log("Response",response);
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   return (
//     <div className="professional-chat">
//       <div className="user-list">
//         {users.map((user) => (
//           <div
//             key={user._id}
//             className={`user ${selectedUser === user._id ? 'selected' : ''}`}
//             onClick={() => {
//               setSelectedUser(user._id);
//               setSelectedUserEmail(user.email);
//             }}
//           >
//             <p>{user.firstName} {user.lastName}</p>
//           </div>
//         ))}
//       </div>
//       {selectedUser && (
//         <Chat userId={selectedUser} userEmail={selectedUserEmail} />
//       )}
//     </div>
//   );
// };

// export default ProfessionalChat;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfessionalChat.css';
import { Link } from 'react-router-dom';
import ProfessionalUserChat from './ProfessionalUserChat';



const ProfessionalChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const professionalId = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const [professionalEmail, setProfessionalEmail] = useState(null);
  

  useEffect(() => {
    fetchUsers();
  }, [professionalEmail]);

  useEffect(() => {
    fetchProfessionalEmail();
  }, [professionalId, token]);

  const fetchProfessionalEmail = async () => {
    try {
      const response = await axios.get(`https://healthmate-backend.onrender.com/api/users/${professionalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setProfessionalEmail(response.data.email);
    } catch (error) {
      console.error('Error fetching professional email:', error);
    }
  };

  const fetchUsers = async () => {
    if (professionalEmail) {
      try {
        const response = await axios.get(`https://healthmate-backend.onrender.com/api/professional/chat/users/${professionalEmail}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log("Response", response);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    window.location.href = '/';
  };

  const handle_Dashboard = () =>{
    window.history.back();

  }

  return (
    
    <div className="professional-chat">
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
            <Link to="/Profile">
              <button className="nav-button">
                Profile
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
       

      <div className="user-list">
        
        {users.map((user) => (
          <div
            key={user._id}
            className={`user ${selectedUser === user._id ? 'selected' : ''}`}
            onClick={() => {
              setSelectedUser(user._id);
              setSelectedUserEmail(user.email);
            }}
          >
            <div>
                <strong><p>{user.firstName} {user.lastName}</p></strong>
                Reply to the chat
            </div>
            <br/>
            
          </div>
        ))}
      </div>
      {selectedUser && professionalEmail && (
        <ProfessionalUserChat
        userEmail={selectedUserEmail}
        professionalEmail={professionalEmail}
      />
      
      
      
      )}
    </div>
  );
};

export default ProfessionalChat;
