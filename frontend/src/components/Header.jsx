import logo from "../assets/logo.jpg";
import styles from "../styles/Header.module.css";

import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <h2 className={styles.site_name}><Link to="/">Puzzle Royale</Link></h2>
        </header>
    )
};

export default Header;