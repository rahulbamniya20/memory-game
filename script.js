"use strict";

// Select DOM elements
const cards = document.querySelectorAll(".card");
const timer = document.querySelector(".timer");
const moves = document.querySelector(".moves");
const overlay = document.querySelector(".overlay-window");
const winningWindow = document.querySelector(".winning-window");
const gameOver = document.querySelector(".game-over-window");
const tookMin = document.querySelector(".took-min");
const tookMoves = document.querySelector(".took-moves");
const tookSec = document.querySelector(".took-sec");

// Initialize game variables
let counter = 0;        // Timer counter
let movCounter = 0;     // Move counter
let matchedCards = 0;   // Number of matched card pairs
let score = 0;          // Score (unused in this code)

// Timer function
const timerFn = function () {
  // Calculate minutes and seconds
  const minute = String(Math.floor(counter / 60)).padStart(2, 0);
  const sec = String(counter % 60).padStart(2, 0);
  
  // Update timer display
  timer.textContent = `${minute}:${sec}`;
  
  // Check win condition
  if (matchedCards === cards.length / 2 && counter < 60) {
    clearInterval(timerFn);
    winningWindow.classList.add("visible");
    tookMin.textContent = minute;
    tookMoves.textContent = movCounter;
    tookSec.textContent = sec;
  } 
  // Check lose condition
  else if (counter > 60) {
    clearInterval(timerFn);
    gameOver.classList.add("visible");
  } 
  // Continue timer
  else {
    counter++;
  }
};

// Move counter function
const movesCounter = function () {
  movCounter++;
  moves.textContent = movCounter;
};

// Start game when overlay is clicked
overlay.addEventListener("click", function () {
  overlay.classList.remove("visible");
  document.querySelector(".game-info").classList.remove("hidden");
  cards.forEach((card) => {
    card.classList.add("game-active");
  });
  setInterval(timerFn, 1000);  // Start timer
});

// Game functionality variables
let flipped = false;
let firstCard, secondCard;
let lockBoard = false;

// Card flip function
const flippedCard = function () {
  if (lockBoard) return;
  if (this === firstCard) return;
  
  this.classList.toggle("flip");
  
  if (!flipped) {
    // First card flipped
    flipped = true;
    firstCard = this;
    return;
  }
  
  // Second card flipped
  secondCard = this;
  checkForMatch();
};

// Check if flipped cards match
const checkForMatch = function () {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unFlipcard();
};

// Handle matched cards
const disableCards = function () {
  firstCard.removeEventListener("click", flippedCard);
  secondCard.removeEventListener("click", flippedCard);
  resetBoard();
  movesCounter();
  matchedCards++;
};

// Handle unmatched cards
const unFlipcard = function () {
  lockBoard = true;
  movesCounter();
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1000);
};

// Reset board after each turn
const resetBoard = function () {
  [flipped, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
};

// Shuffle cards
const shuffle = function () {
  cards.forEach((card) => {
    let randomNum = Math.floor(Math.random() * 16);
    card.style.order = randomNum;
  });
};

shuffle();

// Initialize or reset game
const init = function (e) {
  console.log(e);
  if (e.target.classList.contains("btn")) {
    // Reset game variables
    counter = 0;
    matchedCards = 0;
    movCounter = -1;
    
    // Hide win/lose windows
    winningWindow.classList.remove("visible");
    gameOver.classList.remove("visible");
    
    // Reset and shuffle cards
    cards.forEach((card) => {
      card.classList.remove("flip");
      setTimeout(() => {
        shuffle();
        card.addEventListener("click", flippedCard);
      }, 500);
    });
    
    movesCounter();
  }
};

// Add event listeners for game restart
winningWindow.addEventListener("click", init);
gameOver.addEventListener("click", init);

// Add click event listeners to all cards
cards.forEach((card) => card.addEventListener("click", flippedCard));
