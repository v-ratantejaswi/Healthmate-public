import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = ({ userEmail, professionalId, professionalEmail }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const [senderEmail, setSenderEmail] = useState(null);


  useEffect(() => {
    // Fetch messages from the database here
    // Update messages state with the fetched data
  }, [professionalId]);

  useEffect(() => {
    const fetchSenderEmail = async () => {
      try {
        const response = await axios.get(`https://healthmate-backend.onrender.com/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setSenderEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching sender email:', error);
      }
    };
  
    if (userId && token) {
      fetchSenderEmail();
    }
  }, [userId, token]);

  useEffect(() => {
    fetchMessages();
  }, [userId, userEmail, professionalId, professionalEmail, token]);


  const fetchMessages = async () => {
    if (userEmail && professionalEmail) {
      try {
        const response = await axios.get(
          `https://healthmate-backend.onrender.com/api/chat/${userEmail}/${professionalEmail}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          },
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    }
  };
  
  
  

  const sendMessage = async () => {
    
    const message = {
      sender_email: senderEmail,
      receiver_email: professionalEmail, // Replace with the professional's email
      message: input,
      time: new Date().toISOString(),
    };

    // Send the message to the server and save it in the database
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

  return (
    <div className="chat">
        <button className="refresh-button" onClick={fetchMessages}>
            Refresh
        </button>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.sender_email === senderEmail ? 'sent' : 'received'}`}


          >
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

export default Chat;
