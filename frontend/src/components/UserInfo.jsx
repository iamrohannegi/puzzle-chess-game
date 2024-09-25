import { Link } from "react-router-dom";
import styles from "../styles/UserInfo.module.css";

const UserInfo = (props) => {
    return (
        <div className={styles.userSection}>
            <div className={styles.userInfo}>
                <h3 className={styles.username}>{props.user.name}</h3>
                <p>Total Games Played: <span>{props.user.total_games}</span></p>
                <p>Record: <span>{props.user.first_place}</span> Wins, <span>{props.user.second_place}</span> Runner-ups, <span>{props.user.third_place}</span> Thirds</p>
                <Link to="/logout" className="boxBtn">Log out</Link>
            </div>
            <div className={styles.chart}>
                <h4 className={styles.chartHeader}>Top Three Finishes Percentages</h4>
                <figure className={styles.piechart} style={{ "--first": props.user.first_place, "--second": props.user.second_place, "--third": props.user.third_place, "--total-games": props.user.total_games}}></figure>
                <div className={styles.chartInfo}>
                    <p className={styles.firstPlace}>1st place</p>
                    <p className={styles.secondPlace}>2nd place</p>
                    <p className={styles.thirdPlace}>3rd place</p>
                </div>
            </div>
        </div>
    )
}

export default UserInfo;