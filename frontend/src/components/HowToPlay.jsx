import styles from '../styles/HowToPlay.module.css';

const HowToPlay = () => {   
    return (
        <div className={styles.rules}>
            <h5 className={styles.rulesHeading}>How to play?</h5>
            <ol>
                <li><span>Solve Puzzles:</span> A new chess puzzle appears every 15 seconds. Drag and drop pieces on the board to solve the puzzle.</li>
                <li><span className={styles.ulHeading}>Earn Points:</span>
                    <ul>
                        <li>The first player to solve the puzzle earns 10 points.</li>
                        <li>Players who solve the puzzle after that get fewer points, with a minimum of 1 point if they solve it.</li>
                        <li>If you don’t solve the puzzle, you get 0 points.</li>
                    </ul>
                </li>
                <li>
                    <span>Reach the Target:</span>The game continues until someone scores 100 points or more.
                </li>
                <li><span>Winning:</span> The player with the most points at the end of the game is declared the winner.</li>
            </ol>
        </div>
    );
}

export default HowToPlay;