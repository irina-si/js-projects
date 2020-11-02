const table = document.querySelector(".board");
let playerOneCounter = 0;
let playerTwoCounter = 0;
const newGameButton = document.getElementById("newGameButton");
let allRows = table.querySelectorAll("tr");
const gameFieldArray = new Array(9).fill(0);

let timer = false;
let strokeCounter = 0;

function tableEventListener(event) {
    if (timer) return;
    if (event.target.tagName != "TD") return;
    if (!!gameFieldArray[event.target.id]) return;
    putMarker(sign = "cross", event.target);
    if (whoWin()) return;
    if (strokeCounter === 9) return endGame("Bald!");
    computerPlayer();
};

function initiateGameField() {
    table.addEventListener("click", tableEventListener);
}

function putMarker(sign, target) {
    strokeCounter++;
    let td = target;
    if (sign == "cross") {
        td.classList.add("board__cell_tick");
        gameFieldArray[td.id] = 1;
    } else {
        td.classList.add("board__cell_tock");
        gameFieldArray[td.id] = 2;  
    }
}

function newGame() {
    for (let row of allRows) {
        for (cell of row.cells) {
            cell.classList.remove("board__cell_tick", "board__cell_tock");
        }
    }  
    strokeCounter = 0;
    gameFieldArray.fill(0);
}

function computerPlayer() {
    if (!gameFieldArray.includes(0)) return;
    let position = Math.floor(Math.random() * 9);
    if (!!gameFieldArray[position]) {
        return computerPlayer();
    }
    timer = true;
    setTimeout(function () {
        putMarker("zero", document.getElementById(`${position}`));
        timer = false;
        whoWin();
    }, 900)
}

function whoWin() {
    const crossWin = "111";
    const zeroWin = "222";
    let isWin = false;
    checkWin(crossWin, phrase="Cross won!");
    checkWin(zeroWin, phrase="Zero won!");

    function checkWin (signString, phrase) {
      switch (signString) {
        case (gameFieldArray.slice(0, 3).join("")):
        case (gameFieldArray.slice(3, 6).join("")):
        case (gameFieldArray.slice(6, 9).join("")):    
        case (`${gameFieldArray[0]}${gameFieldArray[3]}${gameFieldArray[6]}`):
        case (`${gameFieldArray[1]}${gameFieldArray[4]}${gameFieldArray[7]}`):
        case (`${gameFieldArray[2]}${gameFieldArray[5]}${gameFieldArray[8]}`):
        case (`${gameFieldArray[0]}${gameFieldArray[4]}${gameFieldArray[8]}`):
        case (`${gameFieldArray[2]}${gameFieldArray[4]}${gameFieldArray[6]}`):
            if (signString === "111") {
                counter("cross")} else {
                    counter("zero");
            };
            endGame(phrase);
            isWin = true;

       }
   }
   return isWin;
}

function endGame(phrase) {
    let winnerCover = document.querySelector(".winnerCover");
    winnerCover.innerHTML = `<span class="winnerCover_text">${phrase}</span>`;
    winnerCover.classList.remove("winnerCover_hidden"); 
    table.removeEventListener('click', tableEventListener);
    winnerCover.focus();
    winnerCover.onblur = function() {
        winnerCover.classList.add("winnerCover_hidden");
        newGame();
        initiateGameField();
    }
}

// IIFE for starting
(function startTheGame() {
    newGameButton.onclick = function() {
        newGame();
        this.blur();
    }
    initiateGameField();
})()

function counter(sign) {
    if (sign == "cross") {
        playerOneCounter++;
        document.getElementById("player-one")
                .querySelector('.player__score').innerHTML = playerOneCounter;
    } else {
        playerTwoCounter++;
        document.getElementById("player-two")
                .querySelector('.player__score').innerHTML = playerTwoCounter;
    }
}