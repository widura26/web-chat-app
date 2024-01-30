import './css/navbar.css';
import React, {useState, useEffect} from 'react';
// import Cookies from 'js-cookie';
// import { NavLink, useNavigate  } from 'react-router-dom';

const Navbar = () => {
    const [clock, setClock] = useState('');
    
    useEffect(() => {
        setInterval(() => {
            const currentDate = new Date();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const seconds = currentDate.getSeconds();

            const h = hours < 10 ? '0' + hours : hours;
            const m = minutes < 10 ? '0' + minutes : minutes;
            const s = seconds < 10 ? '0' + seconds : seconds;
            setClock(`${h} : ${m} : ${s}`)
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
