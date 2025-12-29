//game constant and variables

let inputDir = { x: 0, y: 0 }; // snake not move initial direction
const foodSound = new Audio("./music/eat-food.mp3");
const gameOverSound = new Audio("./music/game-over.mp3");
const moveSound = new Audio("./music/snake-turn.mp3");
const backgroundMusicSound = new Audio("./music/background.mp3");
let speed = 6; // also update speed
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
food = { x: 6, y: 7 };

let isPaused = false;  // paused button


// game function
function main(currentTime) {
  window.requestAnimationFrame(main);

  // AGAR GAME PAUSE HAI
  if (isPaused) return;

  //   console.log(currentTime);
  if ((currentTime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  } //last time paint

  lastPaintTime = currentTime;
  gameEngine();
}

// function isCollide

function isCollide(snake) {
  // if you bump in to yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  // if you bump into the wall
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    return true;
  }
}

function gameEngine() {
  // part 1 : updating the snake array & food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    backgroundMusicSound.pause();
    inputDir = { x: 0, y: 0 };
    // alert("Game Over press any key to play again!");

    // custom swal with html sweet alert2

    Swal.fire({
      icon: "error",
      title: "Oops...",
      html: `
    <div>
      <p>Try again to get highScore! 🙂</p>
      <p>Best of luck 👍</p>
    </div>
  `,
      confirmButtonText: "OK",
    });

    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
  }

  // if you have eaten the food, increment the score and regenerate the food

  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();

    // score or highScore
    score += 1;
    if (score > highScoreValue) {
      highScoreValue = score;
      localStorage.setItem("highScore", JSON.stringify(highScoreValue));
      highScoreBox.innerHTML = "HighScore: " + highScoreValue;
    }
    scoreBox.innerHTML = "Score: " + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });

    let a = 2;
    let b = 16;

    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  // Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // part 2 : display the snack and food
  // display the snake

  board.innerHTML = "";
  snakeArr.forEach((element, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = element.y; //y row
    snakeElement.style.gridColumnStart = element.x; // x column
    // add css
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }

    board.appendChild(snakeElement);
  });

  // display the food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y; //y row
  foodElement.style.gridColumnStart = food.x; // x column
  foodElement.classList.add("food"); // add css
  board.appendChild(foodElement);
}

// highscore logic

let highScore = localStorage.getItem("highScore");
if (highScore === null) {
  highScoreValue = 0;
  localStorage.setItem("highScore", JSON.stringify(highScoreValue));
} else {
  highScoreValue = JSON.parse(highScore);
  highScoreBox.innerHTML = "HighScore: " + highScore;
}

// game loop for paint
// main logic start here

window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {

    /// pause button

  if (e.key === "p" || e.key === "P") {
  isPaused = !isPaused;

  if (isPaused) {
    backgroundMusicSound.pause();
  } else {
    backgroundMusicSound.play();
  }
  return;
}
  //start game

  backgroundMusicSound.play(); //start game music

  //when any one press kay  // first event and second arrow function
  inputDir = { x: 0, y: 1 }; // start the game snake move down
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      console.log("ArrowUp");
      inputDir.x = 0;
      inputDir.y = -1;

      break;

    case "ArrowDown":
      console.log("ArrowDown");
      inputDir.x = 0;
      inputDir.y = 1;
      break;

    case "ArrowLeft":
      console.log("ArrowLeft");
      inputDir.x = -1;
      inputDir.y = 0;
      break;

    case "ArrowRight":
      console.log("ArrowRight");
      inputDir.x = 1;
      inputDir.y = 0;
      break;

    default:
      break;
  }


});

document.getElementById("pauseBtn").addEventListener("click", () => {
  isPaused = !isPaused;
  backgroundMusicSound[isPaused ? "pause" : "play"]();
});

// mobile code

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  e.preventDefault();
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: false });

document.addEventListener("touchmove", (e) => {
  e.preventDefault();
}, { passive: false });

document.addEventListener("touchend", (e) => {
  e.preventDefault();

  let touchEndX = e.changedTouches[0].clientX;
  let touchEndY = e.changedTouches[0].clientY;

  let diffX = touchEndX - touchStartX;
  let diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    inputDir = diffX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
  } else {
    inputDir = diffY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
  }

  moveSound.play();
  backgroundMusicSound.play();
}, { passive: false });

