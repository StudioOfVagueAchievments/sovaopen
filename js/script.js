$(function() {
    var canvas = $('#canvas')[0];
    if ($(window).width() > 1200) {
	canvas.width = 1280;
	canvas.height = 853;
    } else if ($(window).width() > 576) {
	canvas.width = 680;
	canvas.height = 253;
    } else if ($(window).width() > 310) {
	canvas.width = 480;
	canvas.height = 53;
    }  

    var ctx = canvas.getContext('2d');

    var snake = [
        { x: 50, y: 100, oldX: 0, oldY: 0 },
        { x: 50, y: 90, oldX: 0, oldY: 0 },
        { x: 50, y: 80, oldX: 0, oldY: 0 },
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

    function gameLoop() {
	clearCanvas();
	drawFood();
	moveSnake();
	drawSnake();
    }
    function moveSnake() {
        $.each(snake, function(index, value){
            snake[index].oldX = value.x;
            snake[index].oldY = value.y;

            if (index == 0) {
                if (keyPressed == DOWN || keyPressed == S) {
                    snake[index].y = value.y + blockSize;
                } else if (keyPressed == UP || keyPressed == W) {
                    snake[index].y = value.y - blockSize;
		} else if (keyPressed == RIGHT || keyPressed == D) {
                    snake[index].x = value.x + blockSize;
                } else if (keyPressed == LEFT || keyPressed == A) {
                    snake[index].x = value.x - blockSize;
                }
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
			speed += 0.99;
                        inter *= speed;

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

    $(document).keydown(function(e) {
        if ($.inArray(e.which, [DOWN, UP, LEFT, RIGHT, S, W, A, D]) != -1) {
            keyPressed = checkKeyIsAllowed(e.which);
        }
    });

    function checkKeyIsAllowed(tempKey){
        let key;
        if (tempKey == DOWN) {
            key = (keyPressed != UP) ? tempKey : keyPressed;
        } else if (tempKey == UP) {
            key = (keyPressed != DOWN) ? tempKey : keyPressed;
        } else if (tempKey == RIGHT) {
            key = (keyPressed != LEFT) ? tempKey : keyPressed;
        } else if (tempKey == LEFT) {
            key = (keyPressed != RIGHT) ? tempKey : keyPressed;
        }

	if (tempKey == S) {
            key = (keyPressed != W) ? tempKey : keyPressed;
        } else if (tempKey == W) {
            key = (keyPressed != S) ? tempKey : keyPressed;
        } else if (tempKey == D) {
            key = (keyPressed != A) ? tempKey : keyPressed;
        } else if (tempKey == A) {
            key = (keyPressed != D) ? tempKey : keyPressed;
        }
        return key;
    }

    function gameOver(score) {
        clearInterval(game);
        alert('GameOver...\nYour score is: '+ score);
        var gameOverLink = document.getElementById('buttonlink');
        window.location.href='https://studioofvagueachievments.github.io/sovaopen/index.html';
    }

    function getNewPositionForFood() {
        let xArr =  yArr = [], xy;
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
        if($.inArray(newX, xArr) == -1 && $.inArray(newY, yArr) != -1) {
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
