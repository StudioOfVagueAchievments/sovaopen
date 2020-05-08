/* JSON Result */
var data = {
    difficult: 0,
    errors: 0,
    counter: 0
}

/* Event Click To .menu-item */
var i = 0;
while (i < document.getElementsByClassName('menu-item').length) {
    document.getElementsByClassName('menu-item')[i].addEventListener('click', function() {
        document.getElementById("menu").style.display = "none";

        data.difficult = parseInt(this.dataset.lvl);
        const attempts = parseInt(this.dataset.attempts);

        buildDeck(data.difficult);

        /* Change To String */
        switch (data.difficult) {
            case 4:
                data.difficult = "Easy";
                break;
            case 6:
                data.difficult = "Medium";
                break;
            default:
                data.difficult = "Hard";
                break;
        } // data.difficult

        /* Event Click To .cell */
        let j = 0;
        while (j < document.getElementsByClassName('cell').length) {
            document.getElementsByClassName('cell')[j].addEventListener('click', function() {
                this.classList.add("clicked");
                this.innerHTML = this.dataset.num;

                /* Attempts clicked */
                switch (document.getElementsByClassName("clicked").length === 2) {
                    case true:
                        let first = document.getElementsByClassName("clicked")[0];
                        let second = document.getElementsByClassName("clicked")[1];
                        switch (document.getElementsByClassName("clicked")[0].dataset.num === document.getElementsByClassName("clicked")[1].dataset.num) {
                            case true: // Good 
                                /* Change score */
                                data.counter += 1;
                                document.getElementById("attCounter").innerHTML = data.counter;

                                first.remove();
                                second.remove();
                                break;
                            default: // Bad 
                                data.errors += 1;

                                setTimeout(() => {
                                    first.innerHTML = " ";
                                    second.innerHTML = " ";

                                    first.classList.remove("clicked");
                                    second.classList.remove("clicked");
                                }, 250);
                                break;
                        } // document.getElementsByClassName("clicked")[0].dataset.num === document.getElementsByClassName("clicked")[1].dataset.num
                        switch (document.getElementsByClassName("cell").length === 0) {
                            case true: // Good
                                gameOver();
                                break;
                            default: // Wrong
                                switch (data.errors == attempts) {
                                    case true:
                                        gameOver();
                                        break;
                                    default:
                                        break;
                                } // data.errors == attempts
                                break;
                        } // END ?
                        break;
                    default:
                        break;
                } // document.getElementsByClassName("clicked").length === 2
            }, false);
            j++;
        } // document.getElementsByClassName('cell').length
    }, false);
    i++;
} // document.getElementsByClassName('menu-item').length

function buildDeck(rows) {
    // Temporary variables
    let pics = [];
    let i = rows * rows / 2;

    while (i--) {
        pics[i] = i + 1;
        pics[i + (rows * rows / 2)] = i + 1;
    }

    /* Randomizing */
    i = rows * rows;
    while (i--) {
        let rand = getRandomInt(rows * rows / 2);
        let temp = pics[i];
        pics[i] = pics[rand];
        pics[rand] = temp;
    }

   

    /* Styling */
    switch (data.difficult) {
        case 4:
            document.getElementById("body").style.margin = "16em auto";
            document.getElementById("body").innerHTML = "<div id=deck style=grid-template-columns:repeat(4,1fr);></div>";
            document.getElementById("body").innerHTML += "<span id=attCounter>0</span>";
            break;
        case 6:
            document.getElementById("body").style.margin = "10em auto";
            document.getElementById("body").innerHTML = "<div id=deck style=grid-template-columns:repeat(6,1fr);></div>";
            document.getElementById("body").innerHTML += "<span id=attCounter>0</span>";
            break;
        case 8:
            document.getElementById("body").style.margin = "3em auto";
            document.getElementById("body").innerHTML = "<div id=deck style=grid-template-columns:repeat(8,1fr);></div>";
            document.getElementById("body").innerHTML += "<span id=attCounter>0</span>";
            break;
    }

    /* Draw cell */
    i = rows * rows;
    while (i--) {
        let space = " ";
        document.getElementById("deck").innerHTML += "<span" + space + "class=cell" + space + "data-num=" + pics[i] + "></span>";
    }
}

function gameOver() {
    document.getElementById("body").innerHTML = "<div id=result style=grid-template-columns:repeat(1,1fr);>" +
        "difficult:" + data.difficult + " " +
        "errors:" + data.errors + " " +
        "success:" + data.counter + 
        "<a href=https://studioofvagueachievments.github.io/sovaopen/ role=button>Go Home</a>" + "</div>";
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}