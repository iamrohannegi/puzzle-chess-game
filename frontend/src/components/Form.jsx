import { useState } from 'react';
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useNavigate, Link } from 'react-router-dom';
import styles from "../styles/Form.module.css";
import chessImg from '../assets/background-image.png';

import Container from '../components/Container';

const Form = ({route, method}) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")    
    const [errorState, setErrorState] = useState(false)
    const navigate = useNavigate()

    const form_type = method == "login" ? "Login" : "Register"

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validUsername = username.length > 20 ? username.slice(0, 20): username; 
        
        try {
            const res = await api.post(route, { username: validUsername, password })
            setErrorState(false)
            if (method == "login") {    
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate("/")
            } else {
                navigate("/login")
            }
            
        } catch (error) {
            setErrorState(true)
        } finally {
            
        }
    }

    return (
        <Container>
                <div className={styles.formContainer}>
                    <div className={styles.sideImg}>
                        <img src={chessImg} alt = "Chess Pieces"/>
                    </div>


                    <div className={styles.formInfo}>
                        <h3 className={styles.formHeading}>Join the Ultimate Chess Puzzle Challenge!</h3>
                        <p className={styles.formText}>Compete in real-time chess puzzles! Create or join rooms, solve fast, and climb the leaderboard. Every move counts!</p>
                        
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <h1 className={styles.form_name}>{form_type} to play!</h1>
                            <p className={`${styles.error_msg} ${errorState ? "show" : "hidden"}`}>Invalid username or password</p>
                            <input 
                                type="text" 
                                placeholder='Username'
                                value={username}
                                className={errorState ? styles.error : ""}
                                onChange={(e) => setUsername(e.target.value.trim())} 
                                maxLength={20}
                                />
                            <input 
                                type="password" 
                                placeholder='Password'
                                value={password}
                                className={errorState ? styles.error : ""}
                                onChange={(e) => setPassword(e.target.value.trim())} 
                                />
                            <button type="submit" className='boxBtn'>{form_type}</button>
                        </form>

                        {form_type === "Login" && <Link to="/register">Don't have an account? Click here to register.</Link>}
                    </div>
                </div>
                

        </Container>
    )
}   

export default Form;