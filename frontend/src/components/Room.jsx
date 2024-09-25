import kingImg from '../assets/king.png';
import { Link } from 'react-router-dom';
import styles from '../styles/Room.module.css';

const Room = (props) => {
    
    const roomUser = props.roomName.slice(0, props.roomName.indexOf("'"));

    return (
        <div className={styles.roomCard}>
            <div className={styles.roomLogo}>
                <img src={kingImg} alt="King chess piece" />
            </div>
            <div className={styles.roomInfo}>
                <h5 className={styles.roomName}><span>{roomUser}</span>'s Room</h5>
                <p className={styles.roomMembers}>Members Online: <span>{props.roomOnline}</span></p>
                <Link key={props.roomId} to={`/game/${props.roomId}`} className="simpleBtn">Join <span>Room</span></Link>
            </div>
        </div>
    );
};

export default Room;