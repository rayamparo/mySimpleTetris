document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = [
        // 'hsl(0, 100%, 50%)', //red
        // 'hsl(130%, 100%, 50%)', //green
        // 'hsl(180%, 100%, 50%)', //lightblue
        // 'hsl(300%, 100%, 50%)', //pink
        // 'hsl(60%, 100%, 50%)', //yelllow
        // 'hsl(35%, 100%, 50%)', //orange
        // 'hsl(245%, 100%, 50%)' //blue
        // 'blue',
        // 'orange',
        // 'green',
        // 'yellow',
        // 'red',
        // 'purple',
        // 'pink'
        'url(./imgs/blue.png)',
        'url(./imgs/green.png)',
        'url(./imgs/navy.png)',
        'url(./imgs/orange.png)',
        'url(./imgs/pink.png)',
        'url(./imgs/purple.png)',
        'url(./imgs/yellow.png)'
    ]

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const backwardsLTetromino = [
        [width+2, width*2, width*2+1, width*2+2],
        [1, width+1, width*2+2, width*2+1],
        [width, width+1, width+2, width*2],
        [0, width+1, width*2+1, 1]
    ];

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ];

    const backwardsZTetromino = [
        [width+1,width*2+1, width+2, 2],
        [width,width+1,width*2+1,width*2+2],
        [width+1,width*2+1, width+2, 2],
        [width,width+1,width*2+1,width*2+2]
    ];

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ];

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ];

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ];

    const theTetrominoes = [lTetromino, backwardsLTetromino, zTetromino, backwardsZTetromino, tTetromino, oTetromino, iTetromino];
    
    let currentPosition = 4;
    let currentRotation = 0;
    
    
    // Randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][0];
    
    
    // Draw the Tetromino
    function draw() {
        current.forEach(x => {
            squares[currentPosition + x].classList.add('tetromino');
            squares[currentPosition + x].style.backgroundImage = colors[random];
        });
    };


    // Undraw the Tetromino
    function undraw() {
        current.forEach(x => {
            squares[currentPosition + x].classList.remove('tetromino');
            squares[currentPosition + x].style.backgroundImage = '';
        });
    };

    // timerId = setInterval(moveDown, 1000);

    // Assign Keys to Functions
    function control(e) {
        if(e.keyCode === 40) {
            moveDown();
        } else if(e.keyCode === 37) {
            moveLeft();
        } else if(e.keyCode === 39) {
            moveRight();
        } else if(e.keyCode === 38) {
            rotate();
        } else if(e.keyCode === 32) {
            pushDown();
        }
    }

    document.addEventListener('keyup', control);

    // Move down the Tetromino
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    };

    // Move Left the Tetromino
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(x => (currentPosition + x) % width === 0);
        if(!isAtLeftEdge) currentPosition -=1;
        if(current.some(x => squares[currentPosition + x].classList.contains('taken'))) {
            currentPosition +=1;
        }
        draw();
    }

    // Move Right the Tetromino
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(x => (currentPosition + x) % width === width -1);
        if(!isAtRightEdge) currentPosition +=1;
        if(current.some(x => squares[currentPosition + x].classList.contains('taken'))) {
            currentPosition -=1;
        }
        draw();
    }

    // Rotate the Tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if(currentRotation === current.length) currentRotation = 0;
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    // Push down the Tetromino
    function pushDown() {
        undraw();
        // const isAtBottom = current.some(x => squares
        while(!current.some(x => squares[currentPosition + x + width].classList.contains('taken'))) {
            currentPosition += width;
        }
        draw();
        freeze();
    }
    
    // Freeze the Tetromino
    function freeze() {
        if(current.some(x => squares[currentPosition + x + width].classList.contains('taken'))) {
            current.forEach(x => squares[currentPosition + x].classList.add('taken'));
            
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // Show upcoming Shape within the mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    // The Tetromino without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [displayWidth+2, displayWidth*2, displayWidth*2+1, displayWidth*2+2], //backwardsLTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [displayWidth+1,displayWidth*2+1, displayWidth+2, 2], //backwardsZTetromino
        [1, displayWidth, displayWidth+1, displayWidth*2+1], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ];

    // Display the shape in the mini-grid display
    function displayShape() {
        // Remove any trace of a tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundImage = 'none';
        });
        upNextTetrominoes[nextRandom].forEach(x => {
            displaySquares[displayIndex + x].classList.add('tetromino');
            displaySquares[displayIndex + x].style.backgroundImage = colors[nextRandom];
        });
    };

    // Add functionality to button
    startBtn.addEventListener('click', () => {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
            document.getElementById('start-button').disabled = true;
    });

    // Add score
    function addScore() {
        for(let i = 0; i < 188; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if(row.every(x => squares[x].classList.contains('taken'))) {
                score +=10;
                scoreDisplay.innerHTML = score;
                row.forEach(x => {
                    squares[x].classList.remove('taken');
                    squares[x].classList.remove('tetromino');
                    squares[x].style.backgroundImage = '';
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // Game Over
    function gameOver() {
        if(current.some(x => squares[currentPosition + x].classList.contains('taken'))) {
            scoreDisplay.innerHTML = ' :(';
            clearInterval(timerId);
        }
    }

});

