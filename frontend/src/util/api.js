// Python Code:

// def actual_pgn(strpgn):
//     move_no = 1 
//     moves = strpgn.split(" ")
//     with_movenos = [] 
//     for i in range(0, len(moves), 2):
//         if i + 1 < len(moves):
//             with_movenos.append(f'{move_no}. {moves[i]} {moves[i + 1]}')
//         else:
//             with_movenos.append(f'{move_no}. {moves[i]}')
//         move_no += 1 
//     return " ".join(with_movenos)
    
// print(actual_pgn(strpgn))


const PUZZLE_DATA = [
    {
        "fen": "r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24",
        "moves": "f2g3 e6e7 b2b1 b3c1 b1c1 h6c1", 
        "id": "8"     
    },
    {
        "fen": "5r1k/5rp1/p7/1b2B2p/1P1P1Pq1/2R1Q3/P3p1P1/2R3K1 w - - 0 41",
        "moves": "e3g3 f7f4 e5f4 f8f4",
        "id": "000mr",
    },
    {
        "fen":"r6r/1pNk1ppp/2np4/b3p3/4P1b1/N1Q5/P4PPP/R3KB1R w KQ - 3 18",
        "moves":"c7a8 a5c3",
        "id":"001gi",
    }, 
    {
        "fen":"r3k2r/pb1p1ppp/1b4q1/1Q2P3/8/2NP1Pn1/PP4PP/R1B2R1K w kq - 1 17",
        "moves": "h2g3 g6h5",
        "id":"001wb",
    }
]       

export function getRandomPuzzle() {
    return PUZZLE_DATA[Math.floor(Math.random() * PUZZLE_DATA.length)];
}