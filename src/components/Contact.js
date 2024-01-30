
const Contact = (props) => {
    return (
        <div className={`contact-list ${props.activeButton === 'addContact' ? 'class-active' : '' }`}>
            <h1>Daftar kontak</h1>
        </div>
    )
}

export default Contact