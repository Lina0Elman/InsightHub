import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import { config } from '../config';
import { io } from "socket.io-client";

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([] as string[]);
  const socketRef = useRef(null as any);
  
  const connectHandler = () => {
    socketRef.current = io(config.app.backend_url());
    socketRef.current.on(config.socketMethods.messageFromServer, (receivedMessage: string) => {
      setAllMessages((allMessages) => [...allMessages, receivedMessage]);
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
    </div>
  );
};

export default Chat;