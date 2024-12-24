// index.js
import "./style.css";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let speed = 800;
let direction = "s";
const gridElem = 40; // 20 * 20
const snake = [
  [9, 9],
  [8, 9],
  [7, 9],
];
let apple = [5, 5];
let score = 0;

const drawMap = () => {
  const gradient = ctx.createLinearGradient(0, 0, 800, 800);
  gradient.addColorStop(0, "#1e3c72");
  gradient.addColorStop(1, "#2a5298");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 800);
};

const drawSnake = () => {
  for (let i = 0; i < snake.length; i++) {
    const body = snake[i];
    const gradient = ctx.createRadialGradient(
      body[0] * gridElem + gridElem / 2,
      body[1] * gridElem + gridElem / 2,
      5,
      body[0] * gridElem + gridElem / 2,
      body[1] * gridElem + gridElem / 2,
      gridElem / 2
    );
    gradient.addColorStop(0, "#00ff00");
    gradient.addColorStop(1, "#006400");

    ctx.fillStyle = gradient;
    ctx.fillRect(body[0] * gridElem, body[1] * gridElem, gridElem, gridElem);

    ctx.strokeStyle = "#003300";
    ctx.strokeRect(body[0] * gridElem, body[1] * gridElem, gridElem, gridElem);
  }
};

const drawApple = () => {
  const gradient = ctx.createRadialGradient(
    apple[0] * gridElem + gridElem / 2,
    apple[1] * gridElem + gridElem / 2,
    5,
    apple[0] * gridElem + gridElem / 2,
    apple[1] * gridElem + gridElem / 2,
    gridElem / 2
  );
  gradient.addColorStop(0, "#ff0000");
  gradient.addColorStop(1, "#8b0000");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(
    apple[0] * gridElem + gridElem / 2,
    apple[1] * gridElem + gridElem / 2,
    gridElem / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
};

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight": {
      direction = "e";
      break;
    }
    case "ArrowLeft": {
      direction = "o";
      break;
    }
    case "ArrowUp": {
      direction = "n";
      break;
    }
    case "ArrowDown": {
      direction = "s";
      break;
    }
    default: {
    }
  }
});

const gameover = () => {
  if (
    snake[0][0] > 19 ||
    snake[0][0] < 0 ||
    snake[0][1] > 19 ||
    snake[0][1] < 0
  ) {
    return true;
  } else {
    const [head, ...body] = snake;
    for (let bodyElem of body) {
      if (bodyElem[0] === head[0] && bodyElem[1] === head[1]) {
        return true;
      }
    }
  }
  return false;
};

const generateApple = () => {
  const [x, y] = [
    Math.trunc(Math.random() * 20),
    Math.trunc(Math.random() * 20),
  ];
  for (let body of snake) {
    if (body[0] === x && body[1] === y) {
      return generateApple();
    }
  }
  score++;
  apple = [x, y];
};

const updateSnakePosition = () => {
  let head;
  switch (direction) {
    case "e": {
      head = [snake[0][0] + 1, snake[0][1]];
      break;
    }
    case "o": {
      head = [snake[0][0] - 1, snake[0][1]];
      break;
    }
    case "n": {
      head = [snake[0][0], snake[0][1] - 1];
      break;
    }
    case "s": {
      head = [snake[0][0], snake[0][1] + 1];
      break;
    }
    default: {
    }
  }
  snake.unshift(head);
  if (head[0] === apple[0] && head[1] === apple[1]) {
    generateApple();
  } else {
    snake.pop();
  }
  return gameover();
};

const drawScore = () => {
  ctx.fillStyle = "#ffffff";
  ctx.font = "40px sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText(`Score: ${score}`, gridElem, gridElem);
};

const move = () => {
  if (!updateSnakePosition()) {
    drawMap();
    drawSnake();
    drawApple();
    drawScore();
    setTimeout(() => {
      requestAnimationFrame(move);
    }, 1000 - speed);
  } else {
    alert(`Game Over! Final Score: ${score}`);
  }
};

requestAnimationFrame(move);
