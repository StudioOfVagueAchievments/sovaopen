var snakeWidth = snakeHeight = 10;
var blockSize = 10;

var score = 0;
var game;
var inter = 60;
var speed = 0;

let nn = new NeuralNetwork(4, 10, 1);

function setup() {
    nn.setLearningRate(0.01);
    nn.train([1, 1, 0, 0], [1]);
}

$(function() {
    var canvas = $('#canvas')[0];
    if ($(window).width() > 1200) {
        canvas.width = 1280;
        canvas.height = 853;
    } else if ($(window).width() > 576) {
        canvas.width = 580;
        canvas.height = 707;
    } else if ($(window).width() > 410) {
        canvas.width = 380;
        canvas.height = 507;
    } else if ($(window).width() > 310) {
        canvas.width = 280;
        canvas.height = 407;
    }

    var ctx = canvas.getContext('2d');

    var snake = [
        { x: 50, y: 100, oldX: 0, oldY: 0 },
        { x: 50, y: 90, oldX: 0, oldY: 0 },
        { x: 50, y: 80, oldX: 0, oldY: 0 },
    ];
    var food = { x: 200, y: 200, eaten: false };

    game = setInterval(gameLoop, inter);

    function gameLoop() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
    }

    function moveSnake() {
        $.each(snake, function(index, value) {
            snake[index].oldX = value.x;
            snake[index].oldY = value.y;

            if (index == 0) {
                let syn = [];

                if (food.x < value.x) {
                    syn[0] = 0;
                    syn[1] = 0;
                    syn[2] = 0;
                    syn[3] = 1;

                    nn.train(syn, [1]);
                } else if (food.x > value.x) {
                    syn[0] = 0;
                    syn[1] = 1;
                    syn[2] = 0;
                    syn[3] = 0;

                    nn.train(syn, [1]);
                } else if (food.y < value.y) {
                    syn[0] = 0;
                    syn[1] = 0;
                    syn[2] = 1;
                    syn[3] = 0;

                    nn.train(syn, [1]);
                } else if (food.y > value.y) {
                    syn[0] = 1;
                    syn[1] = 0;
                    syn[2] = 0;
                    syn[3] = 0;

                    nn.train(syn, [1]);
                }

                if (food.y > value.y) { // DOWN
                    if (nn.predict(syn) > 0.5) 
                        nn.train(syn, [0]);
                    else
                        nn.train(syn, [1]);

                    if (snake[index + (snake.length - 2)].y > value.y) {
                        if (food.x < value.x)
                            snake[index].x = value.x - blockSize;
                        else
                            snake[index].x = value.x + blockSize;
                    } else 
                        snake[index].y = value.y + blockSize;
                } else if (food.x > value.x) { // RIGHT
                    if (nn.predict(syn) > 0.5)
                        nn.train(syn, [0]);
                    else
                        nn.train(syn, [1]);

                    if (snake[index + (snake.length - 2)].x > value.x && snake[index + (snake.length - 2)].y == value.y) {
                        if (food.y < value.y)
                            snake[index].y = value.y - blockSize;
                        else
                            snake[index].y = value.y + blockSize;
                    } else
                        snake[index].x = value.x + blockSize;
                } else if (food.y < value.y) { // UP
                    if (nn.predict(syn) > 0.5)
                        nn.train(syn, [0]);
                    else
                        nn.train(syn, [1]);

                    if (snake[index + (snake.length - 2)].y > value.y) {
                        if (food.x < value.x)
                            snake[index].x = value.x - blockSize;
                        else
                            snake[index].x = value.x + blockSize;
                    } else
                        snake[index].y = value.y - blockSize;
                } else if (food.x < value.x) { // LEFT
                    if (nn.predict(syn) > 0.5)
                        nn.train(syn, [0]);
                    else
                        nn.train(syn, [1]);

                    if (snake[index + (snake.length - 2)].x < value.x && snake[index + (snake.length - 2)].y == value.y) {
                        if (food.y < value.y)
                            snake[index].y = value.y + blockSize;
                        else
                            snake[index].y = value.y - blockSize;
                    } else
                        snake[index].x = value.x - blockSize;
                } else
                    nn.train(buf, [1]);

            } else {
                snake[index].x = snake[index - 1].oldX;
                snake[index].y = snake[index - 1].oldY;
            }
        });
    }

    function drawSnake() {
        $.each(snake, function(index, value) {
            ctx.fillStyle = 'green';
            ctx.fillRect(value.x, value.y, snakeWidth, snakeHeight);
            if (index == 0) {
                if (collided(value.x, value.y)) {
                    gameOver(score);
                }
                if (didEatFood(value.x, value.y)) {
                    score += 10;
                    $('#score').text(score);
                    makeSnakeBigger();
                    food.eaten = true;

                    if ((score / 10) % 5 == 0) {
                        speed += 0.5;
                        inter *= speed;

                        clearInterval(game);
                        game = setInterval(gameLoop, inter);
                    }
                }
            }
        });
    }

    function makeSnakeBigger() {
        snake.push({
            x: snake[snake.length - 1].oldX,
            y: snake[snake.length - 1].oldY
        });
    }

    function collided(x, y) {
        return snake.filter(function(value, index) {
            return index != 0 && value.x == x && value.y == y;
        }).length > 0 || x < 0 || x > canvas.width || y < 0 || y > canvas.height;
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        if (food.eaten == true) {
            food = getNewPositionForFood();
        }
        ctx.fillRect(food.x, food.y, snakeWidth, snakeHeight);
    }

    function didEatFood(x, y) {
        return food.x == x && food.y == y;
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function gameOver(score) {
        clearInterval(game);
        // alert('GameOver...\nYour score is: ' + score);
        // var gameOverLink = document.getElementById('buttonlink');
        //window.location.href = 'https://studioofvagueachievments.github.io/sovaopen/index.html';
    }

    function getNewPositionForFood() {
        let xArr = yArr = [],
            xy;
        $.each(snake, function(index, value) {
            if ($.inArray(value.x, xArr) != -1) {
                xArr.push(value.x);
            }
            if ($.inArray(value.y, yArr) == -1) {
                yArr.push(value.y);
            }
        });
        xy = getEmptyXY(xArr, yArr);
        return xy;
    }

    function getEmptyXY(xArr, yArr) {
        let newX, newY;
        newX = getRandomNumber(canvas.width - 10, 10);
        newY = getRandomNumber(canvas.height - 10, 10);
        if ($.inArray(newX, xArr) == -1 && $.inArray(newY, yArr) != -1) {
            return {
                x: newX,
                y: newY,
                eaten: false
            };
        } else {
            return getEmptyXY(xArr, yArr);
        }
    }

    function getRandomNumber(max, multipleOf) {
        let result = Math.floor(Math.random() * max);
        result = (result % 10 == 0) ? result : result + (multipleOf - result % 10);
        return result;
    }
});