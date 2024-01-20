import './css/navbar.css';
// import axios from 'axios';
import React from 'react';
import Cookies from 'js-cookie';
import { NavLink, useNavigate  } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    
    const logout = async () => {
        Cookies.remove('accessToken');
        navigate('/');
    }

    return (
        <nav id="navbar">
            <div className="logo-menu">
                <div className="logo"><h1>Chat Application</h1></div>
                <div className="navbar-menus">
                    <ul>
                        <li>
                            <NavLink to="/dashboard">Dashboard</NavLink>
                        </li>
                        <li>
                            <button id='button-logout' onClick={logout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
