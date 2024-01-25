import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const User = (props) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [oneChat, setOneChat] = useState('');
    
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

    const allChats = async () => {
        try {
            const chats = await axios.get('http://localhost:5000/chats', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${props.cookie}`,
                },
            })
        } catch (error) {
            
        }
    }

    useEffect(() => {
        loadUsers();
    }, [loadUsers])
    
    
    return (
        <>
            {   loading ? ( <p>loading...</p> ) : (
                users.map(user => (
                    <div className="user" key={user._id} id={user._id} onClick={props.showChatContainer}>
                        <div className="photo"></div>
                        <div className="username-message">
                            <div className="username">
                                <span>{user.username}</span>
                            </div>
                            <div className="message">
                                <span>Hi, Good Morning</span>
                            </div>
                        </div>
                    </div>
                )) ?? 'null' )
            }
        </>
    )
}

export default User;