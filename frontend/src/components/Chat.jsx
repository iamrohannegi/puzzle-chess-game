import { useEffect, useState, useRef } from 'react';
import styles from "../styles/Chat.module.css";

const formatMessage = (text) => {
    let splitIdx = 0
    for (let i = 0; i < text.length; i++) {
        if (text[i] === "#") {
            splitIdx = i;
            break;
        }
    }
    const name_len = parseInt(text.substring(0, splitIdx));
    const username = text.substring(splitIdx + 1, splitIdx + 1 + name_len);
    const message = text.substring(splitIdx + 1 + name_len);
    
    return <li key={text} className={styles.messages}><span>{username}</span>: {message}</li>
}

const Chat = (props) => {
    const [inputText, setInputText] = useState("");
    const inputTextRef = useRef(inputText);
    const chatRef = useRef(null);

    useEffect(() => {
        inputTextRef.current = inputText;
    }, [inputText])

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key == "Enter") {
                console.log("Got the keypress!")
                handleTextSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        }
    }, [])
    

    useEffect(() => {
        chatRef.current.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth", 
          });
    }, [props.messages])

    const handleTextSubmit = () => {
        const currentText = inputTextRef.current.trim();

        if (!currentText) {
            console.log("Got not input text");
            return "";
        }

        props.onMessageSend(currentText);
        setInputText("")
    }


    return (
        <div className={styles.chat}>
            <h4 className={styles.chat_title}>Chat</h4>
            <div className={`${styles.chatboard} custom-scrollbar`} ref={chatRef}>
                {
                    props.messages && 
                    <ol>
                        { props.messages.map(msg => formatMessage(msg))}
                    </ol>
                }
            </div>
            <div className={styles.input_div}>
                <input type="text" placeholder='Type your message here..' value={inputText} onChange={(e) => setInputText(e.target.value)}/>
                <button onClick={handleTextSubmit}>Send</button>
            </div>
        </div>
    );
}

export default Chat;
