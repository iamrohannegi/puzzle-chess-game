import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN } from "../constants"

import Header from  '../components/Header';
import Container from "../components/Container";
import Rooms from "../components/Rooms";

import styles from "../styles/Home.module.css";
import UserInfo from "../components/UserInfo";
import Loading from "../components/Loading";

const Home = () => {
    const [user, setUser] = useState(null);
    const [roomsLoading, setRoomsLoading] = useState(true);
    const [rooms, setRooms] = useState([]);
    const ws = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Connect to the lobby websocket to get updated lobbies
        const baseUrl = import.meta.env.VITE_API_URL
        ws.current = new WebSocket(`${baseUrl}/ws/lobby?token=${localStorage.getItem(ACCESS_TOKEN)}`)
        
        ws.current.onmessage = e => {
            // Set the game rooms available based on the data received from django channels
            const data = JSON.parse(e.data)

            if (data.type === "rooms") {
                setRoomsLoading(false)
                setRooms(data.rooms)
            }
            else if (data.type === "new_game") {
                navigate(`/game/${data.room_name}`)
            } 
            else if (data.type === "user_info") {
                setUser(data.data)
            } 
        }

        const wsCurrent = ws.current 

        return () => {
            if (wsCurrent.readyState === 1) {
                wsCurrent.close()
            }
        }
    }, [])

    const handleCreateGame = (isPrivate) => {
        const message = {
            "type": "create_game",
            "isPrivate": isPrivate
        }
        
        ws.current.send(JSON.stringify(message))
    };

    const handleRefreshLobby = () => {
        setRooms([])
        setRoomsLoading(true)
        const message = {
            "type": "refresh_lobby"
        }
        ws.current.send(JSON.stringify(message))
    }

    return (
        <>  
            
            <Header />
            <div className={styles.home}>
                <Container>
                    {
                        user && 
                        <>
                            <UserInfo user={user} />
        
                            <div className={styles.newGame}>
                                <p>Start Playing</p>
                                {/* <button onClick={handleCreateGame} className="simpleBtn">Create a New Game</button> */}
                                <button onClick={() => handleCreateGame(true)} className="simpleBtn">Private Room</button>
                                <button onClick={() => handleCreateGame(false)} className="simpleBtn">Public Room</button>
                            </div>
        
                            <Rooms rooms={rooms} isLoading={roomsLoading} onRefreshLobby={handleRefreshLobby}/>
                        </>
                    }

                    {
                        !user && <Loading />
                    }
                    
                </Container>
            </div>
        </>
    )
}

export default Home