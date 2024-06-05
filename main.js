import Deck, { Card } from "./deck.js";


const playerCards = document.querySelector(".player1");
const computerCards = document.querySelector(".player2");
const playerDeckDiv = document.querySelector(".player1-deck");
const computerDeckDiv = document.querySelector(".player2-deck");
const btnReset = document.getElementById("btn-reset");
const text = document.querySelector("#game-state");
const warBtn = document.querySelector(".war-btn");

let gameDeck, playerDeck, computerDeck, gameRound, stopGame

let warState = false;

// War Cards array for War State
let warArr = [];

//Cards Value
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

//Click handler events for each situation
playerCards.addEventListener("click", () => {
    if (stopGame) {
        startGame();
        return
    }

    if (gameRound) {
        cleanBoard()
    } else {
        playRound()
    }
})

//Function to start the game give each player an even ammount of cards
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

//Function to clean the board whenever needed

function cleanBoard() {
    gameRound = (warState === true) ? true : false;
    playerDeckDiv.innerHTML = "";
    computerDeckDiv.innerHTML = "";
    updateCardsNum()
}

// A Fucntion to physically display the cards and check for winners or a state of draw
function playRound() {
    cleanBoard();
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

//Updates the number of cards all the time
function updateCardsNum() {
    playerCards.innerHTML = playerDeck.numberOfCards;
    computerCards.innerHTML = computerDeck.numberOfCards;
}

//Checking Card values to detremine round winner or enter a state of war

function checkForWinner(cardOne, cardTwo) {
    let cardOneValue, cardTwoValue;

    cardOneValue = CARD_VALUE_MAP[cardOne.value];
    cardTwoValue = CARD_VALUE_MAP[cardTwo.value];

    if (cardOneValue > cardTwoValue) {
        playerDeck.push(cardOne);
        playerDeck.push(cardTwo)
        text.innerHTML = "Player Wins";
    } else if (cardTwoValue > cardOneValue) {
        computerDeck.push(cardOne)
        computerDeck.push(cardTwo);
        text.innerHTML = "Computer Wins"
    }

    if (cardOneValue === cardTwoValue && playerDeck.numberOfCards <= 3 || computerDeck.numberOfCards <= 3) {
        playerDeck.push(cardOne);
        computerDeck.push(cardTwo);
        text.innerHTML = "Draw";
        return;
    } else if (cardOneValue === cardTwoValue) {
        warBtn.style.display = "block"
        text.innerHTML = "War!";
        warArr.push(cardOne);
        warArr.push(cardTwo);
        warState = true;
        playerCards.classList.add("disableCard")
    }

    if (gameOver(playerDeck)) {
        text.innerHTML = "You Lose"
        stopGame = false;
        gameRound = true;
        playerCards.classList.add("disableCard")
        btnReset.style.display = "block"
        updateCardsNum()
    } else if (gameOver(computerDeck)) {
        text.innerHTML = "You Win!"
        stopGame = false;
        gameRound = true;
        playerCards.classList.add("disableCard")
        btnReset.style.display = "block"
        updateCardsNum();
    }
}

//Starts the war function

warBtn.addEventListener("click", warFunction);

function warFunction() {
    cleanBoard();
    const playerTopCard = playerDeck.pop();
    const computerTopCard = computerDeck.pop();
    updateCardsNum();
    console.log(playerTopCard.cardHTML());
    playerDeckDiv.appendChild(playerTopCard.cardHTML());
    computerDeckDiv.appendChild(computerTopCard.cardHTML());
    warArr.push(playerTopCard, computerTopCard);

    const cardsAnimation = document.querySelectorAll(".hiddenCard");
    cardsAnimation.forEach(card => {
        card.classList.add("fade-in")
    })

    if (warArr.length > 8) {
        warState = false;
        gameRound = false;
        cleanBoard();
        playerDeckDiv.appendChild(warArr[8].getHTML());
        computerDeckDiv.appendChild(warArr[9].getHTML());
        let cardOneValue, cardTwoValue;


        cardOneValue = CARD_VALUE_MAP[warArr[8].value];
        cardTwoValue = CARD_VALUE_MAP[warArr[9].value];

        const cardsAnimation = document.querySelectorAll(".card");
        cardsAnimation.forEach(card => {
            card.classList.add("fade-in")
        })
        checkWarWinner(cardOneValue, cardTwoValue)
    } else {
        return;
    }
}

//Checks the war Outcome, Either A Winner or a loser, and in a state of draw, distributes the 10 cards from the array evenly to each player

function checkWarWinner(card1, card2) {
    if (card1 > card2) {
        warState = false;
        gameRound = false;
        text.innerHTML = "Player Wins";
        playerDeck.cards = [...warArr, ...playerDeck.cards];
        updateCardsNum()
        warArr = []
        playerCards.classList.remove("disableCard")
        playRound();
    } else if (card2 > card1) {
        warState = false;
        gameRound = false
        text.innerHTML = "Computer Wins"
        computerDeck.cards = [...warArr, ...computerDeck.cards];
        updateCardsNum();
        warArr = []
        playerCards.classList.remove("disableCard")
        playRound();
    } else if (card1 === card2) {
        warState = false;
        gameRound = false
        const halfDeck = Math.ceil(warArr.length / 2);
        text.innerHTML = "Draw";
        const firstHalf = warArr.slice(0, halfDeck);
        const secondHalf = warArr.slice(halfDeck, warArr.length);
        updateCardsNum();
        warArr = []
        playerDeck.cards = [...firstHalf, ...playerDeck.cards];
        computerDeck.cards = [...secondHalf, ...computerDeck.cards];
        playerCards.classList.remove("disableCard")
    }
    warBtn.style.display = "none";
}

function gameOver(deck) {
    return deck.numberOfCards === 0;
}

function resestGame() {
    stopGame = true;
    gameRound = false;
    cleanBoard();
    text.innerHTML = "";
    btnReset.style.display = "none";
    playerCards.classList.remove("disableCard")
    startGame();
}

btnReset.addEventListener("click", resestGame);