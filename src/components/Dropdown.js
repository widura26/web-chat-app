import Cookies from 'js-cookie'
import './css/Dropdown.css'
import { useNavigate  } from 'react-router-dom';

const Dropdown = (props) => {
    const navigate = useNavigate();
    const logout = () => {
        Cookies.remove('accessToken');
        navigate('/'); 
    }
    return (
        <span className='dropdown'>
            <div className='user-menu'>
                <div className='userMenu'>
                    <li>
                        <button onClick={props.showProfile}>Profile</button>
                    </li>
                    <li>
                        <button>Kontak</button>
                    </li>
                    <li>
                        <button onClick={logout}>Keluar</button>
                    </li>
                </div>
            </div>
        </span>
    )
}

export default Dropdown