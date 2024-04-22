import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

const UserChat = ({ userEmail, professionalId, professionalEmail }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMessages();
  }, [userEmail, professionalId, professionalEmail, token]);

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
      sender_email: userEmail,
      receiver_email: professionalEmail,
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

  return (
    <div className="chat">
      <br></br>
      <button className="refresh-button" onClick={fetchMessages}>
        Refresh
      </button>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.sender_email === userEmail ? 'sent' : 'received'}`}
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

export default UserChat;
