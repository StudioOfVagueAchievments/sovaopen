class Key {
    constructor() {
        this.data = DOWN;
    }

    // Is it key or not
    //
    checkKeyIsAllowed(_tempKey) {
        if (_tempKey == DOWN)
            this.data = (this.data != UP) ? _tempKey : this.data;
        else if (_tempKey == UP)
            this.data = (this.data != DOWN) ? _tempKey : this.data;
        else if (_tempKey == RIGHT)
            this.data = (this.data != LEFT) ? _tempKey : this.data;
        else if (_tempKey == LEFT)
            this.data = (this.data != RIGHT) ? _tempKey : this.data;

        if (_tempKey == S)
            this.data = (this.data != W) ? _tempKey : this.data;
        else if (_tempKey == W)
            this.data = (this.data != S) ? _tempKey : this.data;
        else if (_tempKey == D)
            this.data = (this.data != A) ? _tempKey : this.data;
        else if (_tempKey == A)
            this.data = (this.data != D) ? _tempKey : this.data;
    }
}

const canvas = document.querySelector("#canvas");

if (window.innerWidth > 1200) {
    canvas.width = 1280;
    canvas.height = 850;
} else if (window.innerWidth > 576) {
    canvas.width = 580;
    canvas.height = 700;
} else if (window.innerWidth > 410) {
    canvas.width = 380;
    canvas.height = 500;

    initMobile();
} else if (window.innerWidth > 310) {
    canvas.width = 280;
    canvas.height = 400;

    initMobile();
}

const ctx = canvas.getContext("2d");

const snake = [
    { x: 50, y: 80, oldX: 0, oldY: 0 },
    { x: 50, y: 90, oldX: 0, oldY: 0 },
    { x: 50, y: 100, oldX: 0, oldY: 0 },
    { x: 50, y: 110, oldX: 0, oldY: 0 },
    { x: 50, y: 120, oldX: 0, oldY: 0 },
    { x: 50, y: 130, oldX: 0, oldY: 0 }
];

const food = new Food(canvas);

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

const W = 87;
const A = 65;
const S = 83;
const D = 68;

const keyPressed = new Key();
var score = 0;
var inter = 60;
var speed = 0;

let game = setInterval(gameLoop, 60);

// Main loop
//
function gameLoop() {
    clearCanvas();
    food.draw(ctx, snake);
    drawSnake();
    moveSnake();
}

// Translate block from end of snake to some direction
//
const moveSnake = () => {
    let i = snake.length - 1;
    while (i >= 0) {
        snake[i].oldX = snake[i].x;
        snake[i].oldY = snake[i].y;

        if (i === (snake.length - 1)) {
            if ((keyPressed.data === DOWN) || (keyPressed.data === S))
                snake[i].y += 10;
            else if ((keyPressed.data === UP) || (keyPressed.data === W))
                snake[i].y -= 10;
            else if ((keyPressed.data === RIGHT) || (keyPressed.data === D))
                snake[i].x += 10;
            else if ((keyPressed.data === LEFT) || (keyPressed.data === A))
                snake[i].x -= 10;
        } else {
            snake[i].x = snake[i + 1].oldX;
            snake[i].y = snake[i + 1].oldY;
        }
        --i;
    }
};

// Push block from end of snake to screen
//
const drawSnake = () => {
    if (food.IsEat(snake[snake.length - 1].x, snake[snake.length - 1].y)) {
        score += 10;
        document.querySelector("#score").innerHTML = score;
        food.eaten = true;
        makeSnakeBigger();

        if (IsSpeed())
            didSpeed();
    }

    let i = snake.length;
    while (--i) {
        ctx.fillStyle = "#080";
        ctx.fillRect(snake[i].x, snake[i].y, 10, 10);

        if (IsCollided(snake[snake.length - 1].x, snake[snake.length - 1].y)) {
            clearInterval(game);

            const body = document.querySelector("body");

            body.innerHTML = "<div id=result><a class=btn href=https://studioofvagueachievments.github.io/sovaopen/ role=button>Go Home</a></div>";

            body.style.display = "flex";
            body.style.margin = "18em auto";
            body.style.justifyContent = "center";
        }
    }
};

// Add block at the beginning of snake
//
async function makeSnakeBigger() {
    snake.unshift({
        x: snake[snake.length - 1].oldX,
        y: snake[snake.length - 1].oldY
    });
}

// Condition if snake collided
//
const IsCollided = (x, y) => {
    return snake.filter(function(value, index) {
        return index != snake.length - 1 && value.x == x && value.y == y;
    }).length > 0 || x == -10 || x == canvas.width || y == -10 || y == canvas.height;
};

// Condition for acceleration function
//
const IsSpeed = () => {
    return (score / 10) % 5 == 0;
};

// Acceleration
//
const didSpeed = () => {
    speed += 0.99;
    inter *= speed;

    game = setInterval(gameLoop, inter);
};

// Clear screen
//
async function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Create buttons
//
const initMobile = () => {
    document.getElementById("left").addEventListener("click", () => {
        keyPressed.checkKeyIsAllowed(LEFT);
    }, false);

    document.getElementById("right").addEventListener("click", () => {
        keyPressed.checkKeyIsAllowed(RIGHT);
    }, false);

    document.getElementById("up").addEventListener("click", () => {
        keyPressed.checkKeyIsAllowed(UP);
    }, false);

    document.getElementById("down").addEventListener("click", () => {
        keyPressed.checkKeyIsAllowed(DOWN);
    }, false);
};

// Keys
//
document.addEventListener("keydown", e => {
    switch (e.keyCode) {
    case S:
    case DOWN:
        keyPressed.checkKeyIsAllowed(e.keyCode);
        break;

    case W:
    case UP:
        keyPressed.checkKeyIsAllowed(e.keyCode);
        break;

    case A:
    case LEFT:
        keyPressed.checkKeyIsAllowed(e.keyCode);
        break;

    case D:
    case RIGHT:
        keyPressed.checkKeyIsAllowed(e.keyCode);
        break;

    default:
        break;
    }
});
