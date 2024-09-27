import { useEffect, useState } from "react"
import styles from "../styles/WinBoard.module.css";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

const WinBoard = (props) => {
    const [podium, setPodium] = useState([[], [], []])

    
    useEffect(() => {
        let podium_members = [[], [], []];
        let positionIdx = 0;
        let prevScore = props.members[0].score;

        for (const member of props.members) {
            if (member.score < prevScore) {
                prevScore = member.score;
                positionIdx += 1;
            }

            if (positionIdx > 2) {
                break;
            }
            
            podium_members[positionIdx].push(member.name);
        }
        setPodium(podium_members)
    }, [])

    return (
        <div className={styles.winContainer}>
            <Fireworks autorun={{ speed: 2, duration: 2400}} />
            <h4 className={styles.winHeading}>Winners</h4>
            {
                podium && (
                    <div className={styles.medals}>  
                        {/* Gold Medal */}
                        {
                            podium[0].length > 0 && (
                                <div className={styles.medalContainer}>
                                    <div className={styles.medal}>
                                        <div className={`${styles.medalCircle} ${styles.medalCircleGold}`}>
                                            <span>
                                            1
                                            </span>
                                        </div>
                                        <div className={`${styles.medalRibbon} ${styles.medalRibbonLeft}`}></div>
                                        <div className={`${styles.medalRibbon} ${styles.medalRibbonRight}`}></div>
                                    </div>
                                    <div className={styles.medalMembers}>
                                        { podium[0].map(name => <span key={name}>{name}</span>) }
                                    </div>
                                </div>
                            )

                        }
                        {/* Silver Medal */}
                        {
                            podium[1].length > 0 && (
                                <div className={styles.medalContainer}>
                                    <div className={styles.medal}>
                                        <div className={`${styles.medalCircle} ${styles.medalCircleSilver}`}>
                                            <span>
                                            2
                                            </span>
                                        </div>
                                        <div className={`${styles.medalRibbon} ${styles.medalRibbonLeft}`}></div>
                                        <div className={`${styles.medalRibbon} ${styles.medalRibbonRight}`}></div>
                                    </div>
                                    <div className={styles.medalMembers}>
                                        { podium[1].map(name => <span key={name}>{name}</span>) }
                                    </div>
                                </div>
                            )

                        }
                        {/* Bronze Medal */}
                        {
                            podium[2].length > 0 && (
                                <div className={styles.medalContainer}>
                                    <div className={styles.medal}>
                                        <div className={`${styles.medalCircle} ${styles.medalCircleGold}`}>
                                            <span>
                                            3
                                            </span>
                                        </div>
                                        <div className={`${styles.medalRibbon} ${styles.medalRibbonLeft}`}></div>
                                        <div className={`${styles.medalRibbon} ${styles.medalRibbonRight}`}></div>
                                    </div>
                                    <div className={styles.medalMembers}>
                                        { podium[2].map(name => <span key={name}>{name}</span>) }
                                    </div>
                                </div>
                            )

                        }
    
                    </div>
                )
            }
        </div>
    )
}

export default WinBoard;
