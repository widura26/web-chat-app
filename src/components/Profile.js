import './css/Profile.css'
import vector from  '../pages/haerin.jpg';
const Profile = (props) => {
    return (
        <div className={`profile ${props.activeButton === 'profile' ? 'class-active' : '' }`}>
            <div className='back-button'>
                <span className="material-symbols-outlined" onClick={props.closeProfile}>arrow_back</span>
            </div>
            <div className="picture">
                <div className="user-picture">
                    <img src={vector} alt='haerin'></img>
                </div>
            </div>
            <div className="user-information">
                <div className='box'>
                    <div className='name'>
                        <span>Nama Anda</span>
                        <p>{props.username}</p>
                    </div>
                    <div className='info'>
                        <span>Info</span>
                        <p>Baru aja jadian!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;