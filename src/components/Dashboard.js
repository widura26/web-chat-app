import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './css/dashboard.css';
import Cookies from 'js-cookie';
import { socket } from '../socket';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import User from './User';

const Dashboard = () => {

    const [sender, setSender] = useState('');
    const [loggedInUser, setLoggedInuser] = useState('');
    const [username, setUsername] = useState ('');
    const [message, setMessage] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [loadChat, setLoadChats] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [receiver, setReceiver] = useState('');
    const navigate = useNavigate();

    const cookie = Cookies.get('accessToken');
    
    const accessToken = useCallback(async () => {
        try {
            if(cookie){
                const access = await axios.get('http://localhost:5000/dashboard', {
                    headers: {
                        Authorization: `Bearer ${cookie}`
                    }
                });
                setLoggedInuser(access.data.username);
            }else {
                navigate("/");
            }       
        } catch (error) {
            if(error.response && error.response.status === 403){
                console.log(error)
            }
        }
    }, [cookie, navigate])

    const userProfile = useCallback(() => {
        if (cookie) {
            const decodedToken = jwtDecode(cookie);
            setSender(decodedToken);
          }
    }, [cookie])
    
    useEffect(() => {
        accessToken();
        userProfile();
        socket.on("receive_message", (response) => {
            // setMessagesReceive((list) => [...list, response.data.data]);
            setChatMessages([...chatMessages, response.data.data]);
        })
        socket.on('loadChats', (response) => {
            const chats = response.chats;
            setLoadChats(chats);
        })
        return () => {
            socket.off("receive_message");
            socket.off('loadChats');
        }
    }, [accessToken, userProfile, chatMessages])

    const showChatContainer = (e) => {
        setShowChat(true);
        const etarget = e.target.closest('.user');
        const userId = etarget.id;
        const name = etarget.querySelector('span').textContent;
        socket.emit('existsChat', {
            sender_id: sender.id,
            receiver_id: userId
        })
        setUsername(name);
        setReceiver(userId);
    }

    const saveChat = async (e) => {
        e.preventDefault();
        try {
            const create = await axios.post('http://localhost:5000/create-chat', {
                sender_id: sender.id,
                receiver_id: receiver,
                message: message
            }, {
                headers:{
                    "Content-Type": "application/json"
                }
            });
            socket.emit("send_message", create);
            setChatMessages([...chatMessages, create.data.data]);
        } catch (error) {
            console.log(error);
        }
    } 

    const ContainerChat = () => {
        return (
            <>
                <div className="user-profile">
                    <div className="user-header">
                        <div className="photo"></div>
                        <div className="username-message">
                            <div className="username">
                                <span>{username}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chat">
                        {
                            loadChat.map((chat) => {
                                return (
                                <div
                                    key={chat._id}
                                    className={`row ${chat.sender_id === sender.id ? 'row-sender' : 'row-receiver'}`}
                                    id='loadChat'
                                >
                                    <span id='chat'>
                                        {chat.message}
                                        <span id='time'>{chat.createdAt.slice(11, 19)}</span>
                                    </span>
                                </div>
                                );
                            })
                        }
                        {chatMessages.reverse().map((message) => (
                            <div
                            key={message._id}
                            className={`row ${message.sender_id === sender.id ? 'row-sender' : 'row-receiver'}`}
                            id='loadChat'
                            >
                                <span id='chat'>
                                    {message.message}
                                    <span id='time'>{message.createdAt.slice(11, 19)}</span>
                                </span>
                            </div>
                        ))}
                </div>

                <div className="waduh">
                    <form id='form-chat' onSubmit={saveChat}>
                        <div className='chat-input'>
                            <textarea
                                id="textarea"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows="3"
                                cols="130"
                            />
                        </div>
                        <div className='chat-button'>
                            <button type='submit'>Send</button>
                        </div>
                    </form>
                </div>
            </>
        )
    }
    
    return (
        <section id="section-chat">
            <div className="users">
                    <div className="user-header">
                        <div className="photo"></div>
                        <div className="username-message">
                            <div className="username">
                                <span>{loggedInUser}</span>
                            </div>
                        </div>
                    </div>
                <div className="chat-users">
                    <User cookie={cookie} showChatContainer={showChatContainer}/>
                </div>
                <div className="footer">
                    <p>Chat Application 2023</p>
                </div>
            </div>
            
            <div className="chats">
                {
                    showChat && ContainerChat()
                }
            </div>
        </section>
    )
}

export default Dashboard;