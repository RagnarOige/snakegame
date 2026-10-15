const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const gameMessage = document.getElementById('game-message');

const GAME_BOARD_WIDTH = 25;
const GAME_BOARD_HEIGHT = 25;
const TILE_SIZE = 19;
const SNAKE_SIZE = TILE_SIZE;

const CANVAS_WIDTH = GAME_BOARD_WIDTH * TILE_SIZE;
const CANVAS_HEIGHT = GAME_BOARD_HEIGHT * TILE_SIZE;

const GAME_SPEED = 200;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let snakeCoordinates = [
  {
    x: Math.round(GAME_BOARD_WIDTH / 2),
    y: Math.round(GAME_BOARD_HEIGHT / 2)
  }
];

const foodCoordinates = {
  x: undefined,
  y: undefined,
};

let score = 0;
let direction = 'up';
let gameRunning = false;
let intervalId;

function generateFood() {
  let x, y;
  let isInSnake = true;

  while (isInSnake) {
    x = Math.floor(Math.random() * GAME_BOARD_WIDTH);
    y = Math.floor(Math.random() * GAME_BOARD_HEIGHT);

    isInSnake = snakeCoordinates.find(
      c => c.x === x && c.y === y
    );
  }

  foodCoordinates.x = x;
  foodCoordinates.y = y;
}

function drawGameBoard() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawFood() {
  const x = foodCoordinates.x * TILE_SIZE + TILE_SIZE / 2;
  const y = foodCoordinates.y * TILE_SIZE + TILE_SIZE / 2;

  ctx.beginPath();

  ctx.arc(x, y, TILE_SIZE / 2, 0, Math.PI * 2);

  ctx.fillStyle = '#FF0000';
  ctx.fill();
}

function drawSnake() {
  snakeCoordinates.forEach((el) => {
    if (el === snakeCoordinates[0]) {
      ctx.fillStyle = 'lightgreen';
    } else {
      ctx.fillStyle = '#4CAF50';
    }

    const pixelX = el.x * TILE_SIZE;
    const pixelY = el.y * TILE_SIZE;

    ctx.fillRect(pixelX, pixelY, SNAKE_SIZE, SNAKE_SIZE);
  });
}

function drawGrid() {
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;

  for (let x = 0; x <= CANVAS_WIDTH; x += TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }

  for (let y = 0; y <= CANVAS_HEIGHT; y += TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }
}

function draw() {
  drawGameBoard();
  drawFood();
  drawSnake();
  drawGrid();
}

function updateSnakeCoordinates(shouldGrow = false) {
  switch (direction) {

    case 'up': {
      const x = snakeCoordinates[0].x;
      const y = snakeCoordinates[0].y - 1;

      snakeCoordinates.unshift({ x, y });

      if (!shouldGrow) {
        snakeCoordinates.pop();
      }

      break;
    }

    case 'down': {
      const x = snakeCoordinates[0].x;
      const y = snakeCoordinates[0].y + 1;

      snakeCoordinates.unshift({ x, y });

      if (!shouldGrow) {
        snakeCoordinates.pop();
      }
      break;
    }

    case 'left': {
      const x = snakeCoordinates[0].x - 1;
      const y = snakeCoordinates[0].y;

      snakeCoordinates.unshift({ x, y });

      if (!shouldGrow) {
        snakeCoordinates.pop();
      }
      break;
    }

    case 'right': {
      const x = snakeCoordinates[0].x + 1;
      const y = snakeCoordinates[0].y;

      snakeCoordinates.unshift({ x, y });

      if (!shouldGrow) {
        snakeCoordinates.pop();
      }
      break;
    }
  }
}

window.addEventListener('keydown', (e) => {
  switch (e.key) {

    case 'ArrowUp':
      if (direction !== 'down') {
        direction = 'up';
      }
      break;

    case 'ArrowDown':
      if (direction !== 'up') {
        direction = 'down';
      }
      break;

    case 'ArrowLeft':
      if (direction !== 'right') {
        direction = 'left';
      }
      break;

    case 'ArrowRight':
      if (direction !== 'left') {
        direction = 'right';
      }
      break;
  }
});

function isGameOver() {
  const head = snakeCoordinates[0];

  return (
    head.x < 0 ||
    head.x >= GAME_BOARD_WIDTH ||
    head.y < 0 ||
    head.y >= GAME_BOARD_HEIGHT
  );
}

function isFoodEaten() {
  const head = snakeCoordinates[0];

  return (
    head.x === foodCoordinates.x &&
    head.y === foodCoordinates.y
  );
}

function isSnakeHit() {
  const head = snakeCoordinates[0];

  return snakeCoordinates
    .slice(1)
    .some(segment => segment.x === head.x && segment.y === head.y);
}

function gameOver() {
  gameRunning = false;
  clearInterval(intervalId);
  gameMessage.textContent = 'Game Over! Press Start to play again.';
}

function run() {
  if (!gameRunning) {
    return;
  }
  const willEat = isFoodEaten();

  updateSnakeCoordinates(willEat);

  if (isGameOver() || isSnakeHit()) {
    gameOver();
    return;
  }

  if (willEat) {
    score++;
    scoreElement.textContent = score;

    generateFood();
  }

  draw();
}

generateFood();

draw();

startButton.addEventListener('click', () => {

  snakeCoordinates = [
    {
      x: Math.round(GAME_BOARD_WIDTH / 2),
      y: Math.round(GAME_BOARD_HEIGHT / 2)
    }
  ];

  score = 0;
  scoreElement.textContent = score;

  gameRunning = true;
  gameMessage.textContent = '';

  intervalId = setInterval(run, GAME_SPEED);

});