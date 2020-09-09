// Присваиваем --vh для корректного отображения vh на смартфонах
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
})


let elementInCell = 'span';

let event = new Event("click", {
    bubbles: false,
    cancelable: true,
});

// Обьявляем игроков и раунд
let player1 = {
    score: 0,
    symbol: "X",
    color: '#bdbdbd',
    scoreBoard: document.querySelector('.playerXScore'),
};

let player2 = {
    score: 0,
    symbol: "O",
    color: '#000000',
    scoreBoard: document.querySelector('.playerOScore'),
};

let round = {
    initialPlayer: player1,
    currentPlayer: player1,
    clickedCell: 0,
};

//Управление ботом
let labels = document.querySelectorAll('.ai-label');
for (let i = 0; i < labels.length; i++) {
    labels[i].addEventListener('click', function() {
        document.querySelector('.active').classList.remove('active');
        this.classList.add('active');

        endRound();
        round.initialPlayer = player1;
        round.currentPlayer = round.initialPlayer;
        player1.score = 0;
        player2.score = 0;

        player1.scoreBoard.innerHTML = '';
        player2.scoreBoard.innerHTML = '';
        updateInfo();
    });
}


document.querySelector('.currentPlayer').innerHTML = round.initialPlayer.symbol;
document.querySelector('.currentPlayer').style.color = round.initialPlayer.color;

// Вешаем EventListener на ячейки
let cells = document.querySelectorAll(".cell");
for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', clickCell, { once: true });
}
// Функция при клике на ячейку
function clickCell(event) {
    this.querySelector(elementInCell).innerHTML = round.currentPlayer.symbol;
    this.querySelector(elementInCell).style.transform = 'scale(1)';
    this.querySelector(elementInCell).style.color = round.currentPlayer.color;

    round.clickedCell++;


    if (checkRound() == false) {
        if (round.currentPlayer == player1) {
            round.currentPlayer = player2;
        } else {
            round.currentPlayer = player1;
        }

        updateInfo();
        ai();
    }
}
// Проверка на окончание или выигрышь раунда
function checkRound() {

    for (let i = 2; i <= 8; i += 3) {
        if (cells[i].querySelector(elementInCell).innerHTML == cells[i - 1].querySelector(elementInCell).innerHTML &&
            cells[i].querySelector(elementInCell).innerHTML == cells[i - 2].querySelector(elementInCell).innerHTML &&
            cells[i].querySelector(elementInCell).innerHTML != '') {
            winRound();
            return true;
        };
    }

    for (let i = 0; i <= 2; i++) {
        if (cells[i].querySelector(elementInCell).innerHTML == cells[i + 3].querySelector(elementInCell).innerHTML &&
            cells[i].querySelector(elementInCell).innerHTML == cells[i + 6].querySelector(elementInCell).innerHTML &&
            cells[i].querySelector(elementInCell).innerHTML != '') {
            winRound();
            return true;
        };
    }

    if (cells[0].querySelector(elementInCell).innerHTML == cells[4].querySelector(elementInCell).innerHTML &&
        cells[0].querySelector(elementInCell).innerHTML == cells[8].querySelector(elementInCell).innerHTML &&
        cells[0].querySelector(elementInCell).innerHTML != '') {
        winRound();
        return true;
    };

    if (cells[2].querySelector(elementInCell).innerHTML == cells[4].querySelector(elementInCell).innerHTML &&
        cells[2].querySelector(elementInCell).innerHTML == cells[6].querySelector(elementInCell).innerHTML &&
        cells[2].querySelector(elementInCell).innerHTML != '') {
        winRound();
        return true;
    };

    if (round.clickedCell == 9) {
        endRound();
        return true;
    };
    return false;
}
//Обновляем статусы игроков
function winRound() {
    round.clickedCell = 0;
    round.currentPlayer.score++;
    round.currentPlayer.scoreBoard.innerHTML = round.currentPlayer.score;

    endRound();
}
// Конец раунда, смана порядка ходов
function endRound() {
    if (round.initialPlayer == player1) {
        round.initialPlayer = player2;
    } else {
        round.initialPlayer = player1;
    }
    round.currentPlayer = round.initialPlayer;

    round.clickedCell = 0;
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', clickCell);
    }

    setTimeout(() => {
        for (let i = 0; i < cells.length; i++) {
            cells[i].querySelector(elementInCell).innerHTML = '';
            cells[i].querySelector(elementInCell).style.transform = 'scale(0)';

            cells[i].addEventListener('click', clickCell, { once: true });
        }
        ai();
    }, 750);

    updateInfo();
}
// Обновление окна статуса очереди ходов
function updateInfo() {
    document.querySelector('.currentPlayer').innerHTML = round.currentPlayer.symbol;
    document.querySelector('.currentPlayer').style.color = round.currentPlayer.color;
}
// ИИ
function ai() {
    // if (round.currentPlayer == player2 && document.querySelector('#ai').checked == true) {
    if ((round.currentPlayer == player2 && document.querySelector('#normal').checked == true) || (round.currentPlayer == player2 && document.querySelector('#insane').checked == true)) {
        //нападение
        for (let i = 2; i <= 8; i += 3) {
            if (cells[i].querySelector(elementInCell).innerHTML == cells[i - 1].querySelector(elementInCell).innerHTML && cells[i].querySelector(elementInCell).innerHTML == player2.symbol && cells[i - 2].querySelector(elementInCell).innerHTML == '') {
                cells[i - 2].dispatchEvent(event);
                return;
            }
            if (cells[i].querySelector(elementInCell).innerHTML == cells[i - 2].querySelector(elementInCell).innerHTML && cells[i].querySelector(elementInCell).innerHTML == player2.symbol && cells[i - 1].querySelector(elementInCell).innerHTML == '') {
                cells[i - 1].dispatchEvent(event);
                return;
            }
            if (cells[i - 1].querySelector(elementInCell).innerHTML == cells[i - 2].querySelector(elementInCell).innerHTML && cells[i - 1].querySelector(elementInCell).innerHTML == player2.symbol && cells[i].querySelector(elementInCell).innerHTML == '') {
                cells[i].dispatchEvent(event);
                return;
            }
        }

        for (let i = 0; i <= 2; i++) {
            if (cells[i].querySelector(elementInCell).innerHTML == cells[i + 3].querySelector(elementInCell).innerHTML && cells[i].querySelector(elementInCell).innerHTML == player2.symbol && cells[i + 6].querySelector(elementInCell).innerHTML == '') {
                cells[i + 6].dispatchEvent(event);
                return;
            }

            if (cells[i].querySelector(elementInCell).innerHTML == cells[i + 6].querySelector(elementInCell).innerHTML && cells[i].querySelector(elementInCell).innerHTML == player2.symbol && cells[i + 3].querySelector(elementInCell).innerHTML == '') {
                cells[i + 3].dispatchEvent(event);
                return;
            }
            if (cells[i + 6].querySelector(elementInCell).innerHTML == cells[i + 3].querySelector(elementInCell).innerHTML && cells[i + 6].querySelector(elementInCell).innerHTML == player2.symbol && cells[i].querySelector(elementInCell).innerHTML == '') {
                cells[i].dispatchEvent(event);
                return;
            }
        }

        if (cells[0].querySelector(elementInCell).innerHTML == cells[4].querySelector(elementInCell).innerHTML && cells[0].querySelector(elementInCell).innerHTML == player2.symbol && cells[8].querySelector(elementInCell).innerHTML == '') {
            cells[8].dispatchEvent(event);
            return;
        }
        if (cells[0].querySelector(elementInCell).innerHTML == cells[8].querySelector(elementInCell).innerHTML && cells[0].querySelector(elementInCell).innerHTML == player2.symbol && cells[4].querySelector(elementInCell).innerHTML == '') {
            cells[4].dispatchEvent(event);
            return;
        }
        if (cells[8].querySelector(elementInCell).innerHTML == cells[4].querySelector(elementInCell).innerHTML && cells[8].querySelector(elementInCell).innerHTML == player2.symbol && cells[0].querySelector(elementInCell).innerHTML == '') {
            cells[0].dispatchEvent(event);
            return;
        }


        if (cells[2].querySelector(elementInCell).innerHTML == cells[4].querySelector(elementInCell).innerHTML && cells[2].querySelector(elementInCell).innerHTML == player2.symbol && cells[6].querySelector(elementInCell).innerHTML == '') {
            cells[6].dispatchEvent(event);
            return;
        }
        if (cells[2].querySelector(elementInCell).innerHTML == cells[6].querySelector(elementInCell).innerHTML && cells[2].querySelector(elementInCell).innerHTML == player2.symbol && cells[4].querySelector(elementInCell).innerHTML == '') {
            cells[4].dispatchEvent(event);
            return;
        }
        if (cells[4].querySelector(elementInCell).innerHTML == cells[6].querySelector(elementInCell).innerHTML && cells[4].querySelector(elementInCell).innerHTML == player2.symbol && cells[2].querySelector(elementInCell).innerHTML == '') {
            cells[2].dispatchEvent(event);
            return;
        }
        //защита
        for (let i = 2; i <= 8; i += 3) {
            if (cells[i].querySelector(elementInCell).innerHTML == cells[i - 1].querySelector(elementInCell).innerHTML && cells[i].querySelector(elementInCell).innerHTML == player1.symbol && cells[i - 2].querySelector(elementInCell).innerHTML == '') {
                cells[i - 2].dispatchEvent(event);
                return;
            }
            if (cells[i].querySelector(elementInCell).innerHTML == cells[i - 2].querySelector(elementInCell).innerHTML && cells[i].querySelector(elementInCell).innerHTML == player1.symbol && cells[i - 1].querySelector(elementInCell).innerHTML == '') {
                cells[i - 1].dispatchEvent(event);
                return;
            }
            if (cells[i - 1].querySelector(elementInCell).innerHTML == cells[i - 2].querySelector(elementInCell).innerHTML && cells[i - 1].querySelector(elementInCell).innerHTML == player1.symbol && cells[i].querySelector(elementInCell).innerHTML == '') {
                cells[i].dispatchEvent(event);
                return;
            }
        }

        for (let i = 0; i <= 2; i++) {
            if (cells[i].querySelector(elementInCell).innerHTML == cells[i + 3].querySelector(elementInCell).innerHTML && cells[i].querySelector(elementInCell).innerHTML == player1.symbol && cells[i + 6].querySelector(elementInCell).innerHTML == '') {
                cells[i + 6].dispatchEvent(event);
                return;
            }

            if (cells[i].querySelector(elementInCell).innerHTML == cells[i + 6].querySelector(elementInCell).innerHTML && cells[i].querySelector(elementInCell).innerHTML == player1.symbol && cells[i + 3].querySelector(elementInCell).innerHTML == '') {
                cells[i + 3].dispatchEvent(event);
                return;
            }
            if (cells[i + 6].querySelector(elementInCell).innerHTML == cells[i + 3].querySelector(elementInCell).innerHTML && cells[i + 6].querySelector(elementInCell).innerHTML == player1.symbol && cells[i].querySelector(elementInCell).innerHTML == '') {
                cells[i].dispatchEvent(event);
                return;
            }
        }

        if (cells[0].querySelector(elementInCell).innerHTML == cells[4].querySelector(elementInCell).innerHTML && cells[0].querySelector(elementInCell).innerHTML == player1.symbol && cells[8].querySelector(elementInCell).innerHTML == '') {
            cells[8].dispatchEvent(event);
            return;
        }
        if (cells[0].querySelector(elementInCell).innerHTML == cells[8].querySelector(elementInCell).innerHTML && cells[0].querySelector(elementInCell).innerHTML == player1.symbol && cells[4].querySelector(elementInCell).innerHTML == '') {
            cells[4].dispatchEvent(event);
            return;
        }
        if (cells[8].querySelector(elementInCell).innerHTML == cells[4].querySelector(elementInCell).innerHTML && cells[8].querySelector(elementInCell).innerHTML == player1.symbol && cells[0].querySelector(elementInCell).innerHTML == '') {
            cells[0].dispatchEvent(event);
            return;
        }


        if (cells[2].querySelector(elementInCell).innerHTML == cells[4].querySelector(elementInCell).innerHTML && cells[2].querySelector(elementInCell).innerHTML == player1.symbol && cells[6].querySelector(elementInCell).innerHTML == '') {
            cells[6].dispatchEvent(event);
            return;
        }
        if (cells[2].querySelector(elementInCell).innerHTML == cells[6].querySelector(elementInCell).innerHTML && cells[2].querySelector(elementInCell).innerHTML == player1.symbol && cells[4].querySelector(elementInCell).innerHTML == '') {
            cells[4].dispatchEvent(event);
            return;
        }
        if (cells[4].querySelector(elementInCell).innerHTML == cells[6].querySelector(elementInCell).innerHTML && cells[4].querySelector(elementInCell).innerHTML == player1.symbol && cells[2].querySelector(elementInCell).innerHTML == '') {
            cells[2].dispatchEvent(event);
            return;
        }


        if (document.querySelector('#insane').checked == true) {
            if (cells[4].querySelector(elementInCell).innerHTML == '') {
                cells[4].dispatchEvent(event);
                return;
            }

            for (let i = 0; i <= 2; i += 2) {
                if (cells[i].querySelector(elementInCell).innerHTML == '') {
                    cells[i].dispatchEvent(event);
                    return;
                }
                if (cells[i + 6].querySelector(elementInCell).innerHTML == '') {
                    cells[i + 6].dispatchEvent(event);
                    return;
                }
            }
        }

        while (true) {
            let i = Math.floor(Math.random() * 9);
            if (cells[i].querySelector(elementInCell).innerHTML == '') {
                cells[i].dispatchEvent(event);
                break;
            }
        }
        return;
    }
    return;
}