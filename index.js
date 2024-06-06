const numRows = 9;
const numColumns = 9;
const numMines = 10;

const gameBoard = document.getElementById("gameBoard");

let board = [];
let popUp = document.getElementById("popUp");

const restartButton = document.getElementById("restart-Button");
restartButton.addEventListener("click", () => restart());

function getRandomNum(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function boardInitialize(){
    for (let i = 0; i < numRows; i++) {
        board[i] = [];
        for (let j = 0; j < numColumns; j++) {
            board[i][j] = {
                isMine: false,
                reveal: false,
                count: 0
            };
        }
    }
    let minesPlaced = 0;
    let i = 0;
    let j = 0;
    while (minesPlaced < 10) { //account for repeated generation
        let mineCoordY = getRandomNum(0, 9);
        let mineCoordX = getRandomNum(0, 9);
        
        i = mineCoordY; //row
        j = mineCoordX;
        //if i and j no mines, then place
        if (board[i][j].isMine == false) {
            board[i][j].isMine = true;
            minesPlaced++;
        } 
        console.log(mineCoordY, mineCoordX); //test
    }
}



function placeMines() {
    
}

function adjacentMines() {
    let rowCounter = 0;
    let columnCounter = 0;
    for (let a = 0; a < numRows; a++) {
        for (let b = 0; b < numColumns; b++) {
            if (board[a][b].isMine == false) {
                // a = 0, can't count up, a = 9, down
                //b = 0, can't count left, b = 8, right
                //case for center cells
                for (rowCounter = a - 1; rowCounter < a + 2; rowCounter++) {
                    for (columnCounter = b - 1; columnCounter < b + 2; columnCounter++) {
                        if (rowCounter >= 0 && rowCounter < numRows && columnCounter >= 0 && columnCounter < numColumns && board[rowCounter][columnCounter].isMine == true) {
                            board[a][b].count = board[a][b].count + 1;
                        }
                    }
                }
            }
        }
    }
}

function revealCell(row, column) {

    if (row < 0 || row >= numRows || column < 0 || column >= numColumns || board[row][column].reveal == true || board[row][column].isMine == true) {
        return;
    }

    board[row][column].reveal = true;

    /*if (board[row][column].isMine === true) {
        alert("Game Over ):");
    }*/

    if (board[row][column].count === 0) {
        for (let a = row - 1; a < numRows + 2; a++){
            for (let b = column - 1; b < numColumns + 2; b++) {
                    revealCell(a, b);
            }
        }
    }
    
}

function gameOver(row, column) {
    
    if (board[row][column].isMine == true) {
        for (let a = 0; a < numRows; a++) {
            for (let b = 0; b < numColumns; b++) {
                if (board[a][b].isMine == true) {
                    board[a][b].reveal = true;
                }
            }
        }
        openPopUp();
    }
    createBoard();
}

function openPopUp() {
    popUp.classList.add("open-popUp");
}

function closePopUp() {
    popUp.classList.remove("open-popUp");
}
    
function createBoard() {
    gameBoard.innerHTML = "";

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            let cell = document.createElement("div");
            cell.className = "cell";

            if (board[i][j].reveal == true) {
                cell.classList.add ("reveal");
                
                if (board[i][j].isMine == true) {
                    cell.classList.add ("mine");
                    cell.textContent = "!"
                }
                else if (board[i][j].count > 0) {
                    cell.textContent = board[i][j].count;
                }
            }
            cell.addEventListener ("click", () => revealCell(i, j));
            cell.addEventListener ("click", () => gameOver(i, j));
            gameBoard.appendChild(cell);
        }
        gameBoard.appendChild(document.createElement("br"));
    }
}

function restart() {
    board = [];
    boardInitialize(); 
    board.forEach(cell => cell.textContent = "");
    adjacentMines();
    createBoard();
}



boardInitialize();
//placeMines();
adjacentMines();
createBoard();
