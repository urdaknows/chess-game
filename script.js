document.addEventListener('DOMContentLoaded', () => {
    let board = null;
    let game = new Chess();
    const moveHistory = document.getElementById('move-history');
    let moveCount = 1;
    let useColor = 'w';

    const makeRandomMove = () => {
        const possibleMoves = game.moves();

        if(game.game_over()) {
            alert('Checkmate! Game over.');
        } else {
            const randomIndex = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIndex];
            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount);
            moveCount++;
        }
    };

    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;
    };

    const onDragStart = (source, piece) => {
        return !game.game_over() && piece.search(useColor) === 0;  
    };

    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (move === null) return 'snapback';

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount);
        moveCount++;
    };

    const onSnapEnd = () => {
        board.position(game.fen());
    };

    const boardConfig = {
        showNotation: false,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapbackSpeed: 500,
        snapSpeed: 100
    };

    board = Chessboard('board', boardConfig);

    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
    });

    document.querySelector('.set-pos').addEventListener('click', () => {
        const fenInput = prompt('Enter FEN string:');
        if(fenInput !== null) {
            if(game.load(fenInput)) {
                board.position(fenInput);
                moveHistory.textContent = '';
                moveCount = 1;
                useColor = 'w';
            }else {
                alert('Invalid FEN string. Please try again.');
            }
        }
    });
});