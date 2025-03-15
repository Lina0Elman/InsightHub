import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import { config } from '../config';
import { io } from "socket.io-client";
import { LoginResponse } from '../models/LoginResponse';
import DividedList from '../components/DividedList';
import { Room } from '../models/Room';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState<Room>({ _id: null, messages: [] });
  const [onlineUsers, setOnlineUsers] = useState([] as LoginResponse[]);
  const socketRef = useRef(null as any);
  const userAuthRef = useRef(JSON.parse(localStorage.getItem(config.localStorageKeys.userAuth) as string) as LoginResponse);
  
  const connectHandler = () => {
    socketRef.current = io(config.app.backend_url(), {
      extraHeaders: {
        authorization: `Bearer ${userAuthRef.current.accessToken}`
      }
    });
    socketRef.current.on(config.socketMethods.messageFromServer, (receivedMessage: string) => {
      setRoom((prevRoom: Room) => ({
        _id: prevRoom._id,
        messages: [...prevRoom.messages, receivedMessage],
      }));
    });

    socketRef.current.on(config.socketMethods.onlineUsers, (receivedOnlineUsers: LoginResponse[]) => {
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
    setMessage('');
  };

  const onUserClick = (user : any) => {
    console.log(user);
  };

  return (
    <div className="chat-container">
        <input type="text" onChange={(e) => setMessage(e.target.value)} value={message} />

        <button onClick={() => sendMessageHandler()}>Send Message</button>

        <div className="Container">
          {room.messages.map((m: any, index: any) => <div key={index}>{m}</div>)}
        </div>

        <div className="Container">
          <h3>Online Users: </h3>
          <DividedList onlineUsers={onlineUsers} onUserClick={onUserClick} />
        </div>
    </div>
  );
};

export default Chat;