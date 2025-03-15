import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import { config } from '../config';
import { io } from "socket.io-client";
import { LoginResponse } from '../models/LoginResponse';
import DividedList from '../components/DividedList';
import { Room } from '../models/Room';
import axios from 'axios';

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
    
    socketRef.current.on(config.socketMethods.messageFromServer, ({ roomId, message } : any) => {
      setRoom(prevRoom => {
        if (prevRoom && prevRoom._id === roomId) {
          return { ...prevRoom, messages: [...prevRoom.messages, message] };
        }
        return prevRoom;
      });
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
    if (room._id) {
      socketRef.current.emit(config.socketMethods.messageFromClient, { roomId: room._id, message: message });
      setMessage('');
    }
  };

  const onUserClick = (user : any) => {
    axios.get<Room>(`${config.app.backend_url()}/room/user/${user._id}`, {
      headers: { Authorization: `Bearer ${userAuthRef.current.accessToken}` }
    })
    .then((response) => {
      setRoom(response.data);
      socketRef.current.emit(`${config.socketMethods.enterRoom}`, response.data._id);
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
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