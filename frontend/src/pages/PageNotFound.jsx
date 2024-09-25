import Header from "../components/Header";
import { Link } from 'react-router-dom';

import styles from '../styles/PageNotFound.module.css';

const PageNotFound = () => {
    return (
        <>
            <Header />
            <div className={styles.notFoundContainer}>
                <h3 className={styles.notFoundHeading}>- Page not found -</h3>
                <Link to="/" className="boxBtn">Back to Home</Link>
            </div>
        </>
    )
};

export default PageNotFound