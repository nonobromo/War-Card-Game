import Deck from "./deck.js";


const playerCards = document.querySelector(".player1");
const computerCards = document.querySelector(".player2");
const playerDeckDiv = document.querySelector(".player1-deck");
const computerDeckDiv = document.querySelector(".player2-deck");

const text = document.querySelector("#game-state");

let gameDeck, playerDeck, computerDeck, gameRound, stopGame

const CARD_VALUE_MAP = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14
}

playerCards.addEventListener("click", () => {
    if (stopGame) {
        startGame();
        return
    }

    if (gameRound) {
        cleanBoard()
    } else {
        setTimeout(playRound, 100)
        setTimeout(() => {
            cleanBoard()
            text.innerHTML = "&#8205;"
        }, 2500)
    }
})

startGame();

function startGame() {
    gameDeck = new Deck();
    gameDeck.shuffle();

    const halfDeck = Math.ceil(gameDeck.numberOfCards / 2);
    playerDeck = new Deck(gameDeck.cards.slice(0, halfDeck));
    computerDeck = new Deck(gameDeck.cards.slice(halfDeck, gameDeck.numberOfCards));
    gameRound = false;
    stopGame = false;

    cleanBoard()
}

function cleanBoard() {
    gameRound = false;
    playerDeckDiv.innerHTML = "";
    computerDeckDiv.innerHTML = "";

    updateCardsNum()
}

function playRound() {
    gameRound = true;

    const playerTopCard = playerDeck.pop();
    const computerTopCard = computerDeck.pop();

    playerDeckDiv.appendChild(playerTopCard.getHTML());
    computerDeckDiv.appendChild(computerTopCard.getHTML());

    const cardsAnimation = document.querySelectorAll(".card");

    cardsAnimation.forEach(card => {
        card.classList.add("fade-in")
    })



    updateCardsNum();

    checkForWinner(playerTopCard, computerTopCard)
}

function updateCardsNum() {
    playerCards.innerHTML = playerDeck.numberOfCards;
    computerCards.innerHTML = computerDeck.numberOfCards;
}

function checkForWinner(cardOne, cardTwo) {
    let cardOneValue, cardTwoValue;

    cardOneValue = CARD_VALUE_MAP[cardOne.value];
    cardTwoValue = CARD_VALUE_MAP[cardTwo.value];

    if (cardOneValue > cardTwoValue) {
        playerDeck.push(cardOne);
        playerDeck.push(cardTwo)
        text.innerHTML = "Player Wins"
    } else if (cardTwoValue > cardOneValue) {
        computerDeck.push(cardOne)
        computerDeck.push(cardTwo);
        text.innerHTML = "Computer Wins"
    } else {
        playerDeck.push(cardOne);
        computerDeck.push(cardTwo);
        text.innerHTML = "Draw"
    }

    if (gameOver(playerDeck)) {
        text.innerHTML = "You Lose"
        stop = true;
    } else if (gameOver(computerDeck)) {
        text.innerHTML = "You Win!"
        stop = true;
    }
}

function gameOver(deck) {
    return deck.numberOfCards === 0;
}





