import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';

import Board from '../components/Board';
import Chat from '../components/Chat';
import Members from '../components/Members';
import styles from "../styles/Game.module.css";
import Header from '../components/Header';
import WinBoard from '../components/WinBoard';
import HowToPlay from '../components/HowToPlay';
import Loading from '../components/Loading';
import Countdown from '../components/Countdown';




const TestingConnect = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [puzzle, setPuzzle] = useState(null);
    const [members, setMembers] = useState([]); 
    const [messages, setMessages] = useState([]);
    const [winScreen, setWinScreen] = useState(false); 
    const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);

    const ws = useRef(null);
    const username = useRef(null);
    const levelSelectorRef = useRef(null);

    const params = useParams();
    const navigate = useNavigate();

    const roomOwner = roomName.slice(0, roomName.indexOf("'"));

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_API_URL
        ws.current = new WebSocket(`${baseUrl}/ws/gameroom/${params.id}?token=${localStorage.getItem(ACCESS_TOKEN)}`)
              
        ws.current.onmessage = e => {
            const message = JSON.parse(e.data);

            if (message.type === "members") {
                setMembers(message.members);
                checkForAdminChange(message.members);
            }
            else if (message.type === "messages") {
                setMessages(prevState => [...prevState, message.message]);
            }
            else if (message.type === "puzzle") {
                setWinScreen(false);
                setIsPuzzleSolved(false);
                setPuzzle(message.puzzle);
            } 
            else if (message.type === "win_screen") {
                setPuzzle(null);
                setWinScreen(true);
            } 
            else if (message.type === "username") {
                username.current = message.name;
            }
            else if (message.type === "roomname") {
                setRoomName(message.name);
            }  
            else if (message.type === "game_not_found") {
                // navigate("/page-not-found");
            }

        }   

        const wsCurrent = ws.current;

        return () => {
            if (wsCurrent.readyState === 1) {
                wsCurrent.close()
            }
        }
    }, []);
    
    const checkForAdminChange = (users) => {
        let current_admin = null
        for (let m of users) {
            if ( m.isAdmin ) {
                current_admin = m; 
                break; 
            }
        }
        if ( current_admin.name === username.current ){
            setIsAdmin(true)
        }
    }

    const handleSendMessage = (text) => {
        if (!text) {
            return;
        }
        
        // If there's a connection, send the text message
        if (ws) {
            const message = {
                "type": "chat",
                "body": text
            }
            ws.current.send(JSON.stringify(message))
        }
    }

    const handleStartButton = () => {
        const levelStr = levelSelectorRef.current.value;
        const levelLimit = parseInt(levelStr, 10);
        if (Number.isNaN(levelLimit) || levelLimit < 1000 || levelLimit > 4000) {
            
            return;
        }
        
        if (ws) {
            const message = {
                "type": "start_game",
                "rating": levelStr,
            }
            ws.current.send(JSON.stringify(message))
        }
    };

    const handleFinishPuzzle = () => {
        setIsPuzzleSolved(true);
        if (ws) {
            const message = {
                "type": "update_score",
            }
            ws.current.send(JSON.stringify(message))
        }
    }

    const handleLevelChange = () => {

    }
    
    const handleCopyButton = () => {
        const url = window.location.href;
        
        navigator.clipboard.writeText(url)
            .then(() => {})
            .catch(err => { console.log("Failed to copy")});
    }
    
    return (
        <>
            <Header/>
            <div className={styles.room}>
                {/* Members Online */}
                <aside className={styles.members}>
                    { 
                        <Members members={members} />   
                    }
                </aside>

                {/* Game Screen */}
                <div className={styles.game}>
                    {
                        !roomName && <Loading />
                    } 
                    
                    {
                        roomName && 
                        <>
                            <div className={styles.gameHeader}>
                                <div className={styles.roomMeta}>
                                    <h3 className={styles.roomname}><span className={styles.roomnameOwner}>{roomOwner}</span>'s room<span className={styles.roomMetaSeparator}> |</span></h3>
                                    <button className={styles.roomlink} onClick={handleCopyButton}>Copy Room Link</button>
                                </div>
                                <Link to="/" className="boxBtn">Leave Game</Link>
                            </div>

                            {/* Starting the game  */}
                            {
                                (!puzzle) && (
                                    <div className = {styles.readyGame}>
                                        {
                                            isAdmin && 
                                            (
                                                <>  
                                                    <div>
                                                        <p>Ready to play?</p>
                                                        <button className="boxBtn" onClick={handleStartButton}>Start</button>
                                                    </div>
                                                    <div className={styles.levelContainer}>
                                                        <p>Choose the level of puzzles: </p>
                                                        <select ref={levelSelectorRef} onChange={handleLevelChange}>
                                                            <option value="1000">Upto 1000</option>
                                                            <option value="1300">Upto 1300</option>
                                                            <option value="1500">Upto 1500</option>
                                                            <option value="1800">Upto 1800</option>
                                                            <option value="2000">Upto 2000</option>
                                                            <option value="4000">All levels</option>
                                                        </select>
                                                    </div>
                                                </>
                                            )
                                        }
                                        {
                                            !isAdmin && (
                                                <p>Waiting for admin to start the game...</p>
                                            )
                                        }
                                    </div>
                                )
                            }
                            {

                                (!winScreen && !puzzle) && <HowToPlay />
                            }
                            
                            {/* Shows either the win screen or puzzle*/}
                            { winScreen && <WinBoard members={members} />}


                            {
                                puzzle && (
                                    <div className={styles.gameScreen}>
                                        <div className={styles.gameScreenMeta}>
                                            <p className={`${styles.gameSolved} ${isPuzzleSolved ? "show" : "hidden"}`}><span className={styles.checkmark}>&#10004;</span>Solved</p>
                                            <Countdown finishBy={puzzle.finishBy}/>
                                        </div>
                                        <Board fen={puzzle.fen} solution={puzzle.moves.split(" ")} onFinish={handleFinishPuzzle}/>
                                    </div>
                                )
                            }
                        </>
                    }

                </div>

                {/* Chat */}
                <aside className={styles.chat}>
                {
                    <Chat messages={messages} onMessageSend={handleSendMessage}/>
                }
                </aside>
            </div>
        </>

    )
}

export default TestingConnect;