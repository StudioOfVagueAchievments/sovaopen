var canvas = document.getElementById("canvas");

if (window.screen.width > 1200) {
    canvas.width = 1280;
    canvas.height = 850;
} else if (window.screen.width > 576) {
    canvas.width = 580;
    canvas.height = 700;
} else if (window.screen.width > 410) {
    canvas.width = 380;
    canvas.height = 500;

    document.getElementById('left').addEventListener('click', function() {
        let e = LEFT;
        if ((e in [DOWN, UP, LEFT, RIGHT]) !== -1)
            keyPressed = checkKeyIsAllowed(e);
    }, false);

    document.getElementById('right').addEventListener('click', function() {
        let e = RIGHT;
        if ((e in [DOWN, UP, LEFT, RIGHT]) !== -1)
            keyPressed = checkKeyIsAllowed(e);
    }, false);

    document.getElementById('up').addEventListener('click', function() {
        let e = UP;
        if ((e in [DOWN, UP, LEFT, RIGHT]) !== -1)
            keyPressed = checkKeyIsAllowed(e);
    }, false);

    document.getElementById('down').addEventListener('click', function() {
        let e = DOWN;
        if ((e in [DOWN, UP, LEFT, RIGHT]) !== -1)
            keyPressed = checkKeyIsAllowed(e);
    }, false);
} else if (window.screen.width > 310) {
    canvas.width = 280;
    canvas.height = 400;

    document.getElementById('left').addEventListener('click', function() {
        let e = LEFT;
        if ((e in [DOWN, UP, LEFT, RIGHT]) !== -1)
            keyPressed = checkKeyIsAllowed(e);
    }, false);

    document.getElementById('right').addEventListener('click', function() {
        let e = RIGHT;
        if ((e in [DOWN, UP, LEFT, RIGHT]) !== -1)
            keyPressed = checkKeyIsAllowed(e);
    }, false);

    document.getElementById('up').addEventListener('click', function() {
        let e = UP;
        if ((e in [DOWN, UP, LEFT, RIGHT]) !== -1)
            keyPressed = checkKeyIsAllowed(e);
    }, false);

    document.getElementById('down').addEventListener('click', function() {
        let e = DOWN;
        if ((e in [DOWN, UP, LEFT, RIGHT]) !== -1)
            keyPressed = checkKeyIsAllowed(e);
    }, false);
}

var ctx = canvas.getContext('2d');

var snake = [
    { x: 50, y: 80, oldX: 0, oldY: 0 },
    { x: 50, y: 90, oldX: 0, oldY: 0 },
    { x: 50, y: 100, oldX: 0, oldY: 0 },
    { x: 50, y: 110, oldX: 0, oldY: 0 },
    { x: 50, y: 120, oldX: 0, oldY: 0 },
    { x: 50, y: 130, oldX: 0, oldY: 0 }
];
var food = { x: 200, y: 200, eaten: false };

var snakeWidth = snakeHeight = 10;
var blockSize = 10;

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

const W = 87;
const A = 65;
const S = 83;
const D = 68;

var keyPressed = DOWN;
var score = 0;
var game;
var inter = 60;
var speed = 0;

game = setInterval(gameLoop, inter);

async function gameLoop() {
    clearCanvas();
    drawFood();
    drawSnake();
    moveSnake();
}

function moveSnake() {
    var i = snake.length - 1;
    while (i >= 0) {
        snake[i].oldX = snake[i].x;
        snake[i].oldY = snake[i].y;
        if (i === snake.length - 1) {
            if (keyPressed == DOWN || keyPressed == S)
                snake[i].y += blockSize;
            else if (keyPressed == UP || keyPressed == W)
                snake[i].y -= blockSize;
            else if (keyPressed == RIGHT || keyPressed == D)
                snake[i].x += blockSize;
            else if (keyPressed == LEFT || keyPressed == A)
                snake[i].x -= blockSize;
        } else {
            snake[i].x = snake[i + 1].oldX;
            snake[i].y = snake[i + 1].oldY;
        }
        --i;
    }
}

function drawSnake() {
    if (IsEatFood(snake[snake.length - 1].x, snake[snake.length - 1].y)) {
        score += 10;
        document.getElementById("score").innerHTML = score;
        food.eaten = true;
        makeSnakeBigger();

        if (IsSpeed())
            didSpeed();
    }

    var i = snake.length;
    while (--i) {
        ctx.fillStyle = "#080";
        ctx.fillRect(snake[i].x, snake[i].y, snakeWidth, snakeHeight);

        if (IsCollided(snake[snake.length - 1].x, snake[snake.length - 1].y))
            gameOver(score);
    }
}

async function makeSnakeBigger() {
    snake.unshift({
        x: snake[snake.length - 1].oldX,
        y: snake[snake.length - 1].oldY
    });
}

function IsCollided(x, y) {
    return snake.filter(function(value, index) {
        return index != snake.length - 1 && value.x == x && value.y == y;
    }).length > 0 || x <= 0 || x >= canvas.width || y <= 0 || y >= canvas.height;
}

async function drawFood() {
    ctx.fillStyle = "#922";
    if (food.eaten === true)
        food = getNewPositionForFood();
    ctx.fillRect(food.x, food.y, snakeWidth, snakeHeight);
}

function IsSpeed() {
    return (score / 10) % 5 == 0;
}

function IsEatFood(x, y) {
    return food.x == x && food.y == y;
}

function didSpeed() {
    speed += 0.99;
    inter *= speed;

    game = setInterval(gameLoop, inter);
}

async function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
        case S:
        case DOWN:
            keyPressed = checkKeyIsAllowed(e.keyCode);
            break;

        case W:
        case UP:
            keyPressed = checkKeyIsAllowed(e.keyCode);
            break;

        case A:
        case LEFT:
            keyPressed = checkKeyIsAllowed(e.keyCode);
            break;

        case D:
        case RIGHT:
            keyPressed = checkKeyIsAllowed(e.keyCode);
            break;

        default:
            break;
    }
});

function checkKeyIsAllowed(tempKey) {
    if (tempKey == DOWN) {
        return (keyPressed != UP) ? tempKey : keyPressed;
    } else if (tempKey == UP) {
        return (keyPressed != DOWN) ? tempKey : keyPressed;
    } else if (tempKey == RIGHT) {
        return (keyPressed != LEFT) ? tempKey : keyPressed;
    } else if (tempKey == LEFT) {
        return (keyPressed != RIGHT) ? tempKey : keyPressed;
    }

    if (tempKey == S) {
        return (keyPressed != W) ? tempKey : keyPressed;
    } else if (tempKey == W) {
        return (keyPressed != S) ? tempKey : keyPressed;
    } else if (tempKey == D) {
        return (keyPressed != A) ? tempKey : keyPressed;
    } else if (tempKey == A) {
        return (keyPressed != D) ? tempKey : keyPressed;
    }
}

function gameOver(score) {
    clearInterval(game);
    alert('GameOver...\nYour score is: ' + score);
    var gameOverLink = document.getElementById('buttonlink');
    window.location.href = 'https://studioofvagueachievments.github.io/sovaopen/index.html';
}

function getNewPositionForFood() {
    let xArr = yArr = [];
    let i = 0;
    while (i < snake.length) {
        if ((snake[i].x in xArr) !== 1)
            xArr.push(snake[i].x);
        if ((snake[i].y in yArr) === -1)
            yArr.push(snake[i].y);
        i++;
    }
    return getEmptyXY(xArr, yArr);
}

function getEmptyXY(xArr, yArr) {
    let newX = getRandomNumber(canvas.width - 10, 10);
    let newY = getRandomNumber(canvas.height - 10, 10);
    return ((newX in xArr) !== -1 && (newY in yArr) !== -1) ? {
        x: newX,
        y: newY,
        eaten: false
    } : getEmptyXY(xArr, yArr);
}

function getRandomNumber(max, multipleOf) {
    let result = Math.floor(Math.random() * max);
    return result = (result % 10 == 0) ? result : result + (multipleOf - result % 10);;
}