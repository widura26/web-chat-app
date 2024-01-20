import vector from './hero.jpg';
import axios from "axios";
import React, { useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const [activeButton, setActiveButton] = useState('Sign up');
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState('');
    const [message, setMessage] = useState('');
    const [ error, setError ] = useState('');
    const navigate = useNavigate();

    const Register = async e => {
        e.preventDefault();
        try {
            const create = await axios.post('http://localhost:5000/signup', {
                username: username,
                email: email,
                password: password
            }, {
                headers: {
                    "Content-Type": "application/json" //at first, i got an error 'Data and salt argument required'. In fact, the problem on this line. there is typo 'applications/json'
                },
                withCredentials: false
            });
            setMessage(create.data.message);
        } catch (err) {
            if(err.response){
                setMsg(err.response.data.msg);
            }
        }
    }

    const Login = async e => {
        e.preventDefault();
        try {
            const login = await axios.post('http://localhost:5000/signin', {
                email: email,
                password: password
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            Cookies.set('accessToken', login.data.accessToken, { expires: 1 })
            navigate('/dashboard');
        } catch (error) {
            if(error.response && error.response.status === 404){
                setError('User tidak ditemukan');
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            }
        }
    }

    const handleButtonClick = (buttonText) => {
        setActiveButton(buttonText);
      };

    return (
        <section id="hero">
            <div className="container">
                <div className="image">
                    <img src={vector} alt=""/>
                </div>
                <div className="information">
                    <div className="menu">
                        <ul>
                            <li>
                                <button
                                    className={`button ${activeButton === 'Sign up' ? 'button-active' : ''}`}
                                    onClick={() => handleButtonClick('Sign up')}
                                    >
                                    Sign up
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`button ${activeButton === 'Sign in' ? 'button-active' : ''}`}
                                    onClick={() => handleButtonClick('Sign in')}
                                    >
                                    Sign in
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="container-content">
                        <div className="contents">
                        <div className={`content ${activeButton === 'Sign up' ? 'content-active' : ''}`} id="sign up">
                            <form id='form-sign-up' onSubmit={Register}>
                                <p className='success-message'>{message}</p>
                                <p className='success-message'>{error}</p>
                                <div className='fields'>
                                    <div className='input-field'>
                                        <label>Username</label>
                                        <input type='text' placeholder='John Doe' value={username} onChange={ e => setUsername(e.target.value) }></input>
                                    </div>
                                    <div className='input-field'>
                                        <label>Email</label>
                                        <input type='email' placeholder='JohnDoe@gmail.com' value={email} onChange={ e => setEmail(e.target.value) }></input>
                                    </div>
                                    <div className='input-field'>
                                        <label>Password</label>
                                        <input type='password' placeholder='Johndoe666' value={password} onChange={ e => setPassword(e.target.value) }></input>
                                    </div>
                                </div>
                                <div className='sign-up-button'>
                                    <button id='button-sign-up'>Sign up</button>
                                </div>
                            </form>
                        </div>
                        
                        <div className={`content ${activeButton === 'Sign in' ? 'content-active' : ''}`} id="sign in">
                            <form id='form-sign-in' onSubmit={Login}>
                                <p className='success-message'>{msg}</p>
                                <div className='fields'>
                                    <div className='input-field'>
                                        <label>Email</label>
                                        <input type='email' placeholder='JohnDoe@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                                    </div>
                                    <div className='input-field'>
                                        <label>Password</label>
                                        <input type='password' placeholder='Johndoe666' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                                    </div>
                                </div>
                                <div className='sign-up-button'>
                                    <button id='button-sign-in'>Sign in</button>
                                </div>
                            </form>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home