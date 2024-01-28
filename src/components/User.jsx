import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import haerin from '../pages/haerin.jpg';

const User = (props) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const loadUsers = useCallback(async () => {
        try {
            const apiUsers = await axios.get('http://localhost:5000/users', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${props.cookie}`,
                },
            });
            if(apiUsers.data.data !== null){
                setUsers(apiUsers.data.data);
                setLoading(false);
            }
        } catch (error) {
            alert(error)
        }
    }, [props.cookie]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers])
    
    
    return (
        <>
            {   loading ? ( <p>loading...</p> ) : (
                users.map(user => (
                    <div className="user" key={user._id} id={user._id} onClick={props.showChatContainer}>
                        <div className="photo-user">
                            <div className="photo">
                                <img id="haerin" src={haerin} alt="haerin" />
                            </div>
                        </div>
                        <div className="username-message">
                            <div className="username">
                                <span>{user.username}</span>
                            </div>
                            <div className="message">
                                {
                                    props.chats.filter((chat) => ( 
                                            (props.sender.id === chat.sender_id && user._id === chat.receiver_id) || 
                                            (user._id === chat.sender_id && props.sender.id === chat.receiver_id)
                                            )).slice(-1).map((chat) => (
                                                <span id="highlight-message" key={chat._id}>{chat.message || 'hai'}</span>
                                            ))
                                }
                            </div>
                        </div>
                    </div>
                )) ?? 'null' )
            }
        </>
    )
}

export default User;