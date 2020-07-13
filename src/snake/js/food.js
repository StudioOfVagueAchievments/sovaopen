class Food {
    constructor(_canvas) {
        this.x = 200;
        this.y = 200;
        this.eaten = false;

        this.canvas = _canvas;
    }

    // Spawn new food at random pos
    //
    async draw(_context, _snake) {
        if (this.eaten === true)
            this.setNewPosition(_snake);
        _context.fillStyle = "#922";
        _context.fillRect(this.x, this.y, 10, 10);
    }

    // Condition if snake in food
    //
    IsEat(_x, _y) {
        return this.x == _x && this.y == _y;
    }

    // New food
    //
    setNewPosition(_snake) {
        let xArr = [];
        let yArr = [];

        let i = 0;
        while (i < _snake.length) {
            if ((_snake[i].x in xArr) !== 1)
                xArr.push(_snake[i].x);
            if ((_snake[i].y in yArr) === -1)
                yArr.push(_snake[i].y);
            ++i;
        }

        this.getEmptyXY(xArr, yArr);
    }

    // Random XY
    //
    getEmptyXY(_xArr, _yArr) {
        let newX = getRandomNumber(this.canvas.width - 10, 10);
        let newY = getRandomNumber(this.canvas.height - 10, 10);

        if ((newX in _xArr) !== -1 && (newY in _yArr) !== -1) {
            this.x = newX;
            this.y = newY;
            this.eaten = false;
        } else this.getEmptyXY(_xArr, _yArr);
    }
}

// Simplify random function
//
const getRandomNumber = (max, multipleOf) => {
    let result = Math.floor(Math.random() * max);
    return (result % 10 == 0) ? result : result + (multipleOf - result % 10);
};
