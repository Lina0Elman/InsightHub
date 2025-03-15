import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import { config } from '../config';
import { io } from "socket.io-client";
import { LoginResponse } from '../models/LoginResponse';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([] as string[]);
  const [onlineUsers, setOnlineUsers] = useState([] as string[]);
  const socketRef = useRef(null as any);
  const userAuthRef = useRef(JSON.parse(localStorage.getItem(config.localStorageKeys.userAuth) as string) as LoginResponse);
  
  const connectHandler = () => {
    socketRef.current = io(config.app.backend_url(), {
      extraHeaders: {
        authorization: `Bearer ${userAuthRef.current.accessToken}`
      }
    });
    socketRef.current.on(config.socketMethods.messageFromServer, (receivedMessage: string) => {
      setAllMessages((allMessages) => [...allMessages, receivedMessage]);
    });

    socketRef.current.on(config.socketMethods.onlineUsers, (receivedOnlineUsers: string[]) => {
      setOnlineUsers(receivedOnlineUsers);
    });
  };

  useEffect(() => {
    connectHandler();
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessageHandler = () => {
    socketRef.current.emit(config.socketMethods.messageFromClient, message);
    setMessage('')
  };

  return (
    <div className="chat-container">
        <input type="text" onChange={(e) => setMessage(e.target.value)} value={message} />

        <button onClick={() => sendMessageHandler()}>Send Message</button>

        <div className="Container">
          {allMessages.map((m, index) => <div key={index}>{m}</div>)}
        </div>

        <div className="Container">
          <h3>Online Users: </h3>
          {onlineUsers.map((u, index) => <div key={index}>{u}</div>)}
        </div>
    </div>
  );
};

export default Chat;