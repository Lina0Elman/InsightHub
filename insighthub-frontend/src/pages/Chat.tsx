import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import { config } from '../config';
import { io } from "socket.io-client";

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([] as string[]);
  const [onlineUsers, setOnlineUsers] = useState([] as string[]);
  const socketRef = useRef(null as any);

  // TODO: Replace this with accessToken from localstorage
  const accessTokenRef = useRef("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2FmYTc0MDY4ZjczNmYxMTJhZTFkNTEiLCJyYW5kb20iOjczNzM1NywiaWF0IjoxNzQxOTY5MTEwLCJleHAiOjE3NDE5NzI3MTB9.5Jl8LQL4RJZJkPGzQjLff-WxJi5GLMH3QMftDghUVB8");
  
  const connectHandler = () => {
    socketRef.current = io(`${config.app.backend_url()}/user`, {
      extraHeaders: {
        authorization: `Bearer ${accessTokenRef.current}`
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