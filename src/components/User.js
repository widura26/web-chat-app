import { useEffect, useState } from "react";
import axios from "axios";

const User = (props) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const apiUsers = await axios.get('http://localhost:5000/users', {
                    headers: {
                        Authorization: `Bearer ${props.cookie}`,
                        "Content-Type": "application/json"
                    },
                });
                if(apiUsers.data.data !== null){
                    setUsers(apiUsers.data.data);
                }else{
                    console.log('Tidak ada data user')
                }
            } catch (error) {
                alert(error)
            }
        }

        loadUsers();
    }, [props.cookie])

    return (
        <>
            {   
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
                )) ?? 'null'
            }
        </>
    )
}

export default User;