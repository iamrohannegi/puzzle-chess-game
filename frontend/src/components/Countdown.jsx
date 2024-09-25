import { useState, useEffect } from 'react';
import styles from '../styles/Countdown.module.css';

const Countdown = (props) => {

    const [timeRemaining, setTimeRemaining] = useState(0)

    useEffect(() => {
        if (!props.finishBy) {
            return;
        }

        const targetTime = new Date(props.finishBy);

        const updateTimeRemaining = () => {
            const now = new Date();
            //In milliseconds
            const difference = targetTime - now;

            if (difference > 0) {
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeRemaining(seconds);
            } else {
                setTimeRemaining(0);
                clearInterval(timer);
            }
        }

        updateTimeRemaining()
        const timer = setInterval(updateTimeRemaining, 1000);

        return () => clearInterval(timer);

    }, [props.finishBy])

    return (
        <div className={styles.countdown}>
            <p><span className={timeRemaining <= 5 ? styles.warning : ""}>{timeRemaining}</span>s left</p>
        </div>
    );
}

export default Countdown;