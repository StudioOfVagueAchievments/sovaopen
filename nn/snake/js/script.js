const data = {"input_nodes":4,"hidden_nodes":10,"output_nodes":1,"weights_ih":{"rows":10,"cols":4,"data":[[-0.944784078499379,0.2885428318974933,-0.3851869502214117,-0.7298022428687038],[-0.9182285130543716,0.17140640920854636,0.6920908387747764,-0.7001506769023541],[-0.611130142892363,0.44302770715110873,0.4014878610863164,-0.8965423780217848],[-0.31952043569461175,0.301585994089197,0.036836334037203725,-0.8558828651724214],[-0.3012881148042489,-0.5226837073414825,0.8802824543002449,0.8366210751680339],[-0.8127289164108792,0.6063633132294374,-0.5974714379104487,-0.8971072667369575],[-0.5778319282680175,-0.6306378962075729,-0.32940648388999505,-0.029694078857281633],[-0.7825961228924283,-0.645991991036357,0.8736445198197346,-0.9824872351838833],[-0.9255811695005477,-0.2667172522352838,-0.7109527571557387,0.061344741084863555],[0.6374942576752906,1.0027945534079257,0.8907208721859162,-0.9618233304794518]]},"weights_ho":{"rows":1,"cols":10,"data":[[0.08020785593637347,-0.3758167314260246,0.6403015396180465,0.2942160748236055,0.04879247884690691,-0.7508181096545101,-0.39507389888724,0.7504885129686851,-0.5345215075854028,-0.26522646705580916]]},"bias_h":{"rows":10,"cols":1,"data":[[0.18607202788857888],[0.971358298586822],[-0.6392427058112923],[-0.046220435589920894],[0.6487707122788314],[-0.5525951437884963],[-0.5360380053442548],[0.11756351118367132],[-0.8024531908620516],[-0.6534859613823265]]},"bias_o":{"rows":1,"cols":1,"data":[[0.19562204180581189]]},"learning_rate":0.1,"activation_function":{}};
var nn = NeuralNetwork.deserialize(data);

nn.setLearningRate(0.01);
nn.train([1, 1, 0, 0], [1]);

let canvas = document.getElementById("canvas");
if (window.innerWidth > 1200) {
    canvas.width = 1280;
    canvas.height = 853;
} else if (window.innerWidth > 576) {
    canvas.width = 580;
    canvas.height = 707;
} else if (window.innerWidth > 410) {
    canvas.width = 380;
    canvas.height = 507;
} else if (window.innerWidth > 310) {
    canvas.width = 280;
    canvas.height = 407;
}

var ctx = canvas.getContext("2d");

var snake = [
    { x: 50, y: 80, oldX: 0, oldY: 0 },
    { x: 50, y: 90, oldX: 0, oldY: 0 },
    { x: 50, y: 100, oldX: 0, oldY: 0 },
    { x: 50, y: 110, oldX: 0, oldY: 0 },
    { x: 50, y: 120, oldX: 0, oldY: 0 },
    { x: 50, y: 130, oldX: 0, oldY: 0 }
];
var food = { x: 200, y: 200, eaten: false };

const snakeWidth = 10;
const snakeHeight = 10;
const blockSize = 10;

var score = 0;
var inter = 60;
var speed = 0;

var game = setInterval(gameLoop, inter);

/* #warning async for gameOver function */
// Main loop
//
async function gameLoop() {
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
}

// Train if wrong
function trainingSnake(buf) {
    if (nn.predict(buf) > 0.5)
        nn.train(buf, [0]);
    else
        nn.train(buf, [1]);
}

// Translate block from end of snake to some direction
//
function moveSnake() {
    let i = snake.length - 1;
    while (i >= 0) {
        snake[i].oldX = snake[i].x;
        snake[i].oldY = snake[i].y;

        if (i === snake.length - 1) {
            var syn = [ 0, 0, 0, 0 ];

            if (food.x < snake[i].x) {
                syn[3] = 1;
            } else if (food.x > snake[i].x) {
                syn[1] = 1;
            } else if (food.y < snake[i].y) {
                syn[2] = 1;
            } else if (food.y > snake[i].y) {
                syn[0] = 1;
            }

            if (food.y > snake[i].y) {  // DOWN
                trainingSnake(syn);

                if (snake[snake.length - 2].y > snake[i].y) {
                    if (food.x > snake[i].x)
                        snake[i].x -= blockSize;
                    else
                        snake[i].x += blockSize;
                } else
                    snake[i].y += blockSize;
            } else if (food.x > snake[i].x) { // RIGHT
                trainingSnake(syn);

                if ((snake[snake.length - 2].x > snake[i].x) && (snake[snake.length - 2].y === snake[i].y) && (snake[1].y === snake[0].y)) {
                    if (food.y > snake[i].y)
                        snake[i].y -= blockSize;
                    else
                        snake[i].y += blockSize;
                } else
                    snake[i].x += blockSize;
            } else if (food.y < snake[i].y) { // UP
                trainingSnake(syn);

                if (snake[snake.length - 2].y > snake[i].y) {
                    if (food.x < snake[i].x)
                        snake[i].x -= blockSize;
                    else
                        snake[i].x += blockSize;
                } else
                    snake[i].y -= blockSize;
            } else if (food.x < snake[i].x) { // LEFT
                trainingSnake(syn);

                if ((snake[snake.length - 2].x < snake[i].x) && (snake[snake.length - 2].y === snake[i].y) && (snake[1].y === snake[0].y)) {
                    if (food.y < snake[i].y)
                        snake[i].y += blockSize;
                    else
                        snake[i].y -= blockSize;
                } else
                    snake[i].x -= blockSize;
            } else
                nn.train(syn, [0]);
        } else {
            snake[i].x = snake[i + 1].oldX;
            snake[i].y = snake[i + 1].oldY;
        }
        --i;
    }
}

// Push block from end of snake to screen
//
function drawSnake() {
    if (IsEatFood(snake[snake.length - 1].x, snake[snake.length - 1].y)) {
        score += 10;
        document.getElementById("score").innerHTML = score;
        food.eaten = true;
        makeSnakeBigger();

        if (IsSpeed())
            didSpeed();
    }

    let i = snake.length;
    while (--i) {
        ctx.fillStyle = "#080";
        ctx.fillRect(snake[i].x, snake[i].y, snakeWidth, snakeHeight);

        if (IsCollided(snake[snake.length - 1].x, snake[snake.length - 1].y))
            gameOver();
    }
}

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
function IsCollided(x, y) {
    return snake.filter(function(value, index) {
        return index != snake.length - 1 && value.x == x && value.y == y;
    }).length > 0 || x == -10 || x == canvas.width || y == -10 || y == canvas.height;
}

// Spawn new food at random pos
//
async function drawFood() {
    ctx.fillStyle = "#922";
    if (food.eaten === true)
        food = getNewPositionForFood();
    ctx.fillRect(food.x, food.y, snakeWidth, snakeHeight);
}

// Condition for acceleration function
//
async function IsSpeed() {
    return (score / 10) % 5 == 0;
}

// Condition if snake in food
//
function IsEatFood(x, y) {
    return food.x == x && food.y == y;
}

// Acceleration
//
function didSpeed() {
    speed += 0.99;
    inter *= speed;

    game = setInterval(gameLoop, inter);
}

// Clear screen
//
async function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// End Function
//
function gameOver() {
    clearInterval(game);  // this does not work
}

// New food
//
function getNewPositionForFood() {
    let xArr = [];
    let yArr = [];

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

// Random XY
//
function getEmptyXY(xArr, yArr) {
    let newX = getRandomNumber(canvas.width - 10, 10);
    let newY = getRandomNumber(canvas.height - 10, 10);
    return ((newX in xArr) !== -1 && (newY in yArr) !== -1) ? {
        x: newX,
        y: newY,
        eaten: false
    } : getEmptyXY(xArr, yArr);
}

// Simplify random function
//
function getRandomNumber(max, multipleOf) {
    let result = Math.floor(Math.random() * max);
    return (result % 10 == 0) ? result : result + (multipleOf - result % 10);
}
