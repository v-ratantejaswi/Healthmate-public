// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Chat.css';

// const ProfessionalUserChat = ({ userEmail, professionalEmail }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const token = localStorage.getItem('token');

// useEffect(() => {
//     fetchMessages();
//   }, [userEmail, professionalEmail, token]);

//   const fetchMessages = async () => {
//     if (userEmail && professionalEmail) {
//       try {
//         const response = await axios.get(`https://healthmate-backend.onrender.com/api/professional/chat/${professionalEmail}/${userEmail}`, {

//             headers: {
//               'Authorization': `Bearer ${token}`,
//             },
//           },
//         );
//         setMessages(response.data);
//       } catch (error) {
//         console.error('Error fetching chat messages:', error);
//       }
//     }
//   };

//   const sendMessage = async () => {
//     const message = {
//       sender_email: professionalEmail,
//       receiver_email: userEmail,
//       message: input,
//       time: new Date().toISOString(),
//     };

//     try {
//       const response = await axios.post('https://healthmate-backend.onrender.com/api/chat', message, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.status === 201) {
//         setMessages([...messages, message]);
//         setInput('');
//       } else {
//         console.error('Error sending message:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <div className="chat">
//         <button className="refresh-button" onClick={fetchMessages}>
//             Refresh
//         </button>
//       <div className="chat-messages">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`chat-message ${message.sender_email === professionalEmail ? 'sent' : 'received'}`}
//           >
//             <p>{message.message}</p>
//             <span>{new Date(message.time).toLocaleTimeString()}</span>
//           </div>
//         ))}
//       </div>
//       <div className="chat-input">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={sendMessage} disabled={!input.trim()}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProfessionalUserChat;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  useNavigate, Link } from 'react-router-dom';
import './ProfessionalUserChat.css';

const ProfessionalUserChat = ({ userEmail, professionalEmail }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMessages();
  }, [userEmail, professionalEmail, token]);

  const fetchMessages = async () => {
    if (userEmail && professionalEmail) {
      try {
        const response = await axios.get(`https://healthmate-backend.onrender.com/api/professional/chat/${professionalEmail}/${userEmail}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    }
  };

  const sendMessage = async () => {
    const message = {
      sender_email: professionalEmail,
      receiver_email: userEmail,
      message: input,
      time: new Date().toISOString(),
    };

    try {
      const response = await axios.post('https://healthmate-backend.onrender.com/api/chat', message, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        setMessages([...messages, message]);
        setInput('');
      } else {
        console.error('Error sending message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    window.location.href = '/';
  };

  return (
    
    <div className="professional-user-chat">
      <br></br>
      <br></br>
      <button className="refresh-button" onClick={fetchMessages}>
        Refresh
      </button>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.sender_email === professionalEmail ? 'sent' : 'received'}`}
          >
            <div className="sender-info">
              <strong>{message.sender_email}</strong>
            </div>
            <p>{message.message}</p>
            <span>{new Date(message.time).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ProfessionalUserChat;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {  useNavigate, Link } from 'react-router-dom';
// import './ProfessionalUserChat.css';

// const ProfessionalUserChat = ({ userEmail, professionalEmail }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [fitnessProfessionals, setFitnessProfessionals] = useState([]);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     fetchMessages();
//     fetchFitnessProfessionals();
//   }, [userEmail, professionalEmail, token]);

//   const fetchMessages = async () => {
//     if (userEmail && professionalEmail) {
//       try {
//         const response = await axios.get(`https://healthmate-backend.onrender.com/api/professional/chat/${professionalEmail}/${userEmail}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });
//         setMessages(response.data);
//       } catch (error) {
//         console.error('Error fetching chat messages:', error);
//       }
//     }
//   };

//   const fetchFitnessProfessionals = async () => {
//     try {
//       const response = await axios.get('https://healthmate-backend.onrender.com/api/fitnessProfessionals', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       setFitnessProfessionals(response.data);
//     } catch (error) {
//       console.error('Error fetching fitness professionals:', error);
//     }
//   };

//   const sendMessage = async () => {
//     const message = {
//       sender_email: professionalEmail,
//       receiver_email: userEmail,
//       message: input,
//       time: new Date().toISOString(),
//     };

//     try {
//       const response = await axios.post('https://healthmate-backend.onrender.com/api/chat', message, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.status === 201) {
//         setMessages([...messages, message]);
//         setInput('');
//       } else {
//         console.error('Error sending message:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <div className="professional-user-chat">
//       <div className="left-panel">
//         <h2>SkillSnapshot</h2>
//         <ul className="fitness-professionals-list">
//           {fitnessProfessionals.map((professional, index) => (
//             <li key={index}>{professional.name}</li>
//           ))}
//         </ul>
//       </div>
//       <div className="right-panel">
//         <button className="refresh-button" onClick={fetchMessages}>
//           Refresh
//         </button>
//         <div className="chat-messages">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`chat-message ${message.sender_email === professionalEmail ? 'sent' : 'received'}`}
//             >
//               <p>{message.message}</p>
//               <span>{new Date(message.time).toLocaleTimeString()}</span>
//             </div>
//           ))}
//         </div>
//         <div className="chat-input">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your message..."
//           />
//           <button onClick={sendMessage} disabled={!input.trim()}>
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfessionalUserChat;

