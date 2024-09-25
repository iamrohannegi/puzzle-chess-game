import Room from "./Room";
import styles from '../styles/Rooms.module.css'
import Loading from "./Loading";

const Rooms = (props) => {
    return (
        <div className={styles.rooms}>
            <div>
                <div className={styles.roomsHeader}>
                    <h4 className={styles.roomsHeading}><span>Public </span>Rooms</h4>
                    <button onClick={props.onRefreshLobby} className="simpleBtn">Refresh</button>
                </div>
                <div className={styles.roomCards}>
                    {
                        props.rooms && props.rooms.map(r => <Room roomId={r.link} roomName={r.name} roomOnline={r.members_count}/>)
                    }
                    {
                        props.rooms.isLoading && <Loading />
                    }
                </div>
            </div>
        </div>
    )
}

export default Rooms;