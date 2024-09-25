import { useState, useEffect } from "react";
import { Chess }  from "chess.js";
import { Chessboard } from "react-chessboard";
import audio from "../assets/piece.mp3"; 

import styles from "../styles/Board.module.css"

function Board(props) {
    const [game, setGame] = useState(new Chess());
    const [moveNo, setMoveNo] = useState(0);
    const [canMove, setCanMove] = useState(false);
    const [orientation, setOrientation] = useState("white");
    
    const gameAudio = new Audio(audio);
    //
    // Functionality
    //

    useEffect(() => {
        handleReset()
        setTimeout(() => makeOpponentMove(0), 400);
    }, [props.fen]);

    // Used to highlight the squares once there's a move on board
    // and remove previous higlight from the board
    useEffect(() => {
        const history = game.history({verbose: true})
        if (!history.length) {
            return 
        }

        // Remove style from the previous move 
        if (history.length - 2 >= 0) {
            const prevMove = history[history.length - 2];
            const [squareA, squareB] = [prevMove.from, prevMove.to];

            removeHighlightStyle(squareA, squareB)
        }

        // Add styles to the last move
        const lastMove = history[history.length - 1]
        const [squareA, squareB] = [lastMove.from, lastMove.to]

        addHighlightStyle(squareA, squareB)

    }, [game])


    // Makes the copy of the current game and makes a move on board if legal
    function makeAMove(move) {
        const gameCopy = { ...game };
        console.log(gameCopy)
        const result = gameCopy.move(move);

        if (result) {
            setGame(gameCopy);
            gameAudio.play();
        }
        return result; // null if the move was illegal, the move object if the move was legal
    }

    // Validates if a human move made was correct based on the solution moves provided
    function validateMove(from, to) {
        const [target, dest] = [props.solution[moveNo].slice(0, 2), props.solution[moveNo].slice(2, 4)];

        if ((from !== target) || (to !== dest)) {
            console.log("Wrong move sire")
            return false;
        }

        return true
    }

    // Makes a move if it's your turn in the puzzle. Blocks user from making a move
    // if it's the computer's turn
    function makeAHumanMove(move) {
        if (!canMove) {
            return null;
        }

        return makeAMove(move)
    }

    // Makes the opponent move from the puzzle based on the solution moveset
    function makeOpponentMove(moveIdx) {
        const [from, to] = [props.solution[moveIdx].slice(0, 2), props.solution[moveIdx].slice(2, 4)];

        const move = {
            from,
            to,
            promotion: "q",
        }

        const res = makeAMove(move)
        setMoveNo(moveIdx + 1);
        setCanMove(true);

        // Removing Checkmark
        if (moveIdx != 0) {
            const lastCorrectMoveSquare = props.solution[moveIdx - 1].slice(2, 4);
            removeMarkStyle(lastCorrectMoveSquare, true);
        }

        return res
    }

    
    // Tries to make a legal move after dropping a piece. If it doesn't follow
    // the solution moveset, it undoes that move
    // Also calls the onFinish function once you complete the puzzle
    function onDrop(sourceSquare, targetSquare) {

        const move = makeAHumanMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q", // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return false;
        setCanMove(false);

        const squareElt = document.querySelector(`[data-square=${move.to}]`)

        //Legal move 
        // If the move follows the solution then add a checkmark followed by 
        // a function call that moves the opponent pieces to continue the puzzle
        if (validateMove(move.from, move.to)) {
            console.log("Correct Move");

            // Add checkmark
            squareElt.classList.add("mark", "checkmark");

            // Computer Move
            const moveIdx = moveNo + 1
            setMoveNo(prev => prev + 1);
            
            // There's still moves left, so make computer move
            if (moveIdx < props.solution.length) {
                setTimeout(() => makeOpponentMove(moveIdx), 200);
            } 
            else {
                // Finish the puzzle
                props.onFinish();
            }
        } 
        // If move is incorrect, then add the X mark on the square and then undo the move
        else {
            // Add wrong cross mark
            squareElt.classList.add("mark", "crossmark");
            setTimeout(undoMove, 200);
        }

        return true;
    }

    // Undo a move 
    const undoMove = () => {
        const gameCopy = { ...game }

        const history = gameCopy.history({verbose: true})
        const lastMove = history[history.length - 1]

        removeHighlightStyle(lastMove.from, lastMove.to)
        removeMarkStyle(lastMove.to, false)

        gameCopy.undo()
        setGame(gameCopy)
        setCanMove(true)
    };

    // Resets the entire board to the starting state
    const handleReset = () => {
        const gameCopy = { ...game }
        gameCopy.load(props.fen)
        setGame(gameCopy)
        setMoveNo(0)

        if (gameCopy.turn() === "b") {
            setOrientation("white")
        } else {
            setOrientation("black");
        };

        //Removing any highlights or marks from square if any
        const squares = document.querySelectorAll("[data-square]");
        squares.forEach(square => {
            square.classList.remove("mark", "checkmark", "crossmark", "highlight-square");
        });
    }

    //
    // STYLING FUNCTIONS
    //

    // Removes the checkmark or crassmark from a square
    function removeMarkStyle(square, isCheckmark) {
        const markName = isCheckmark ? "checkmark" : "crossmark";

        const squareElt = document.querySelector(`[data-square=${square}]`);
        squareElt.classList.remove("mark", markName);
    }

    
    // Removes the highlight class from the squares provided
    function removeHighlightStyle(squareA, squareB) {
        const highlightClass = 'highlight-square';

        const squareAElt = document.querySelector(`[data-square="${squareA}"]`)
        squareAElt.classList.remove(highlightClass)
        const squareBElt = document.querySelector(`[data-square="${squareB}"]`)
        squareBElt.classList.remove(highlightClass)
    }
    
    // Adds the highlight class to the squares provided
    function addHighlightStyle(squareA, squareB) {
        const highlightClass = 'highlight-square';

        const squareAElt = document.querySelector(`[data-square="${squareA}"]`)
        squareAElt.classList.add(highlightClass)
        const squareBElt = document.querySelector(`[data-square="${squareB}"]`)
        squareBElt.classList.add(highlightClass)
    }

    //
    // JSX
    //

    return (
        <div className={styles.board}>
            <Chessboard 
                position={game.fen()} 
                onPieceDrop={onDrop} 
                boardOrientation={orientation}
            />
        </div>
    )
}   

export default Board;