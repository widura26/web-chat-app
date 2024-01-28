import './css/navbar.css';
import React, {useState, useEffect} from 'react';
// import Cookies from 'js-cookie';
// import { NavLink, useNavigate  } from 'react-router-dom';

const Navbar = () => {
    // const navigate = useNavigate();
    const [clock, setClock] = useState('');
    
    // const logout = async () => {
    //     Cookies.remove('accessToken');
    //     navigate('/');
    // }
    // const clockc = () => {
    //     const currentDate = new Date();
    //     const hours = currentDate.getHours();
    //     const minutes = currentDate.getMinutes();
    //     const seconds = currentDate.getSeconds();

    //     setClock(`${hours}:${minutes}:${seconds}`)
    // },

    
    useEffect(() => {
        setInterval(() => {
            const currentDate = new Date();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();

        setClock(`${hours} : ${minutes} : ${seconds}`)
        }, 1000);
    })

    return (
        <nav id="navbar">
            <div className="logo-menu">
                <div className="logo"><h1>Chat Application</h1></div>
                <div className="navbar-menus">
                    <ul className='navbar-menu'>
                        <li>
                            <p>{clock}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
