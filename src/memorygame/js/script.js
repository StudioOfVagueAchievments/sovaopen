var openedCounter = 0;
var attemptsMax = 0;
var attempts = 0;
var counter = 0;

document.onload = startGame();

function startGame() {
	var menuItems = $('.menu-item');

	console.log('here', menuItems);
	menuItems.click(onMenuItemClick);
}

function onMenuItemClick() {
	$("#menu").hide();
	var menuItem = $(this);
	var rows = menuItem.data('lvl');
	attempts = menuItem.data('attempts');
	console.log(rows, attemptsMax);
	buildBoard(rows);
};

function onCellClick(rows) {

	if($('.clicked').length >= 2) return;
	
	var cell = $(this);
	cell.addClass('clicked');
	cell.text(cell.data('num'));
	var clickedCells = $('.clicked');
	//attempts modes

	if(clickedCells.length == 2 ) {
		var c1 = $(clickedCells[0]);
		var c2 = $(clickedCells[1]);
		if(c1.data('num')== c2.data('num')) {
			c1.addClass('solved');
			c2.addClass('solved');
		}
		setTimeout(function() {
			c1.text(' ').removeClass('clicked');
			c2.text(' ').removeClass('clicked');

			attempts--;
		},300);	
		if (attempts <= 0) gameOver();
	}
}
function buildBoard(rows) {
	var pics = [];

	for (var i = 0; i< rows*rows/2; i++) {
		pics[i] = i + 1;
		pics[i+(rows*rows/2)] = i + 1;
	}
	var temp;
	var rand;//random number for shuffling
	for (var i = 0; i < rows*rows; i++)//randomizing 
	{
		rand = getRandomInt(rows * rows / 2);
		temp = pics[i];
		pics[i] = pics[rand];
		pics[rand] = temp;
	}
	var cellSize = 100 + 20+ 10;

	var board = $('#board');
	//debugger;
	for(var i = 0; i < rows*rows; i++) {
		var cell = $('<div data-num='+ pics[i] +' class="cell"> </div>');//cell initialization
		//var num = getRandomInt(rows*rows/2);
		//console.log(num);
		//cell.data('img number', pics[i]);
		board.append(cell);
	}
	//style for cells
	board.css("width", cellSize*rows)
	//cell.css(text)
	// var settings1 = $('.rowsChanging') 
	var cells = $('.cell');
	cells.click(onCellClick);
	
}

function gameOver() {
	alert('gameOver');
	rows = 0;
	gameOverText = $('<div>GAME OVER</div>');
	board.append(gameOverText);
}

async function getSum(a, b){
	return a + b;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
