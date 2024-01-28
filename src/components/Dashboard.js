import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './css/dashboard.css';
import Cookies from 'js-cookie';
import { socket } from '../socket';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import vector from '../pages/chat.png'
import io from 'socket.io-client';
import Dropdown from './Dropdown';
import Profile from './Profile';
import User from './User';

const Dashboard = () => {

    const [sender, setSender] = useState('');
    const [loggedInUser, setLoggedInuser] = useState('');
    const [profile, setProfile] = useState();
    const [username, setUsername] = useState ('');
    const [message, setMessage] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [receiver, setReceiver] = useState('');
    const [showMenu, setShowUserMenu] = useState(false);
    // const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);
    // const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const boxRef = useRef(null);
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
                // setUserId(access.data.id)
            }else {
                navigate("/");
            }       
        } catch (error) {
            if(error.response && error.response.status === 403){
                console.log(error)
            }
        }
    }, [navigate, cookie]);

    const userProfile = useCallback(() => {
        if (cookie) {
            const decodedToken = jwtDecode(cookie);
            setSender(decodedToken);
          }
    }, [cookie])

    // const loadUsers = useCallback(async () => {
    //     try {
    //         const apiUsers = await axios.get('http://localhost:5000/users', {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${cookie}`,
    //             },
    //         });
    //         if(apiUsers.data.data !== null){
    //             setUsers(apiUsers.data.data);
    //             setLoading(false);
    //         }
    //     } catch (error) {
    //         alert(error)
    //     }
    // }, [cookie]);

    const allChats = useCallback(async () => {
        try {
            const all = await axios.get('http://localhost:5000/chats', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`,
                },
            })
            const allMessage = all.data.data;
            setChats(allMessage);

        } catch (error) {
            console.log(error);
        }
    }, [cookie])
    
    useEffect(() => {
        document.title = 'Dashboard'
        accessToken();
        userProfile();
        // loadUsers();
        allChats();
        socket.on('loadChats', (response) => {
            const chats = response.chats;
            setChatMessages(chats);
        })
        socket.on("receive_message", (response) => {
            setChatMessages([...chatMessages, response.data.data]);
        })
        io('http://localhost:5000', {
            auth: {
                token: cookie
            }
        })
        const handleClickOutside = (event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
              // Klik di luar box, sembunyikan box
              setShowUserMenu(false);
            }
        };
        // Tambahkan event listener pada dokumen
        document.addEventListener('click', handleClickOutside);
        return () => {
            handleClickOutside();
            allChats();
            socket.off("loadChats");
            socket.off("receive_message");
        }
    }, [accessToken, userProfile, chatMessages, cookie, allChats])

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
    
    const showUserMenu = () => {
        setShowUserMenu(!showMenu);
    }

    const showProfile = () => {
        setProfile(true);
        setShowUserMenu(false)
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
                        <div className='photo-username'>
                            <div className="photo"></div>
                            <div className="username-message">
                                <div className="username">
                                    <span>{username}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chat">
                        {chatMessages.reverse().map((message) => (
                            ((sender.id === message.sender_id && receiver === message.receiver_id) || 
                            (receiver === message.sender_id && sender.id === message.receiver_id)) && (
                                <div key={message._id} className={`row ${message.sender_id === sender.id ? 'row-sender' : 'row-receiver'}`} id='loadChat'>
                                    <span id='chat'>
                                        {message.message}
                                        <span id='time'>{message.createdAt.slice(11, 19)}</span>
                                    </span>
                                </div>
                            )
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
                                cols="120"
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
                <div className="header">
                    <div className="input">
                        <input type='text' className='input-search-user' placeholder='Cari user'/>
                    </div>
                    <div className='menuUser'>
                        <span data-icon="menu" className='three-dots' onClick={showUserMenu}>
                            <svg viewBox="0 0 24 24" height="20" width="20" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24">
                                <title>menu</title>
                                <path fill="currentColor" d="M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z">
                                </path>
                            </svg>
                        </span>
                        { showMenu && <Dropdown showProfile={showProfile}/>}
                    </div>
                </div>
                { profile && <Profile username={loggedInUser} />}
                <div className="chat-users">
                    <User cookie={cookie} chats={chats} sender={sender} showChatContainer={showChatContainer}/>
                    {/* {   loading ? ( <p>loading...</p> ) : (
                        users.map(user => (
                            <div className="user" key={user._id} id={user._id} onClick={showChatContainer}>
                                <div className="photo"></div>
                                <div className="username-message">
                                    <div className="username">
                                        <span>{user.username}</span>
                                    </div>
                                    <div className="message">
                                        {
                                            chats.filter((chat) => ( 
                                                    (sender.id === chat.sender_id && user._id === chat.receiver_id) || 
                                                    (user._id === chat.sender_id && sender.id === chat.receiver_id)
                                                    )).slice(-1).map((chat) => (
                                                        <span key={chat._id}>{chat.message || 'hai'}</span>
                                                    ))
                                        }
                                    </div>
                                </div>
                            </div>
                        )) ?? 'null' )
                    } */}
                </div>
                <div className="footer">
                    <p>Chat Application 2023</p>
                </div>
            </div>
            
            <div className="chats">
                {
                    (showChat && ContainerChat()) || (
                        <div className='image'>
                            <img src={vector} alt='chat' className='chat-image'/>
                        </div>
                    )
                }
            </div>
        </section>
    )
}

export default Dashboard;