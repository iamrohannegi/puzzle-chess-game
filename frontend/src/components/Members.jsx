import styles from '../styles/Members.module.css';
import adminLogo from "../assets/admin.png";


const Members = (props) => {
    return (
        <div className={styles.members}>
            <h4 className={styles.members_title}>Scoreboard</h4>
            <div className={styles.members_screen}>
                {
                    props.members && 
                    <ul className='custom-scrollbar'>
                        { 
                            props.members.map(member => (
                                <li key={member.name} className={styles.member_container}>
                                    <div className={styles.member_info}>   
                                        { member.isAdmin && <img src={adminLogo} alt="Admin logo"/>}
                                        <span className={styles.member_name}>{member.name}</span>
                                    </div>
                                    <span className={styles.member_score}>{member.score}</span>
                                </li>
                            ))
                        }
                    </ul>
                }
            </div>
        </div>
    )
}

export default Members;