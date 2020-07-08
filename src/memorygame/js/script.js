/* JSON Result */
var data = {
    difficult: 0,
    errors: 0,
    counter: 0
};

/* Event Click To .menu-item */
var i = 0;
while (i < document.getElementsByClassName("menu-item").length) {
    document.getElementsByClassName("menu-item")[i].addEventListener("click", function() {
        document.getElementById("menu").style.display = "none";

        data.difficult = parseInt(this.dataset.lvl);
        const attempts = parseInt(this.dataset.attempts);

        buildDeck(data.difficult);

        //gameOver();

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
        }  // data.difficult

        /* Event Click To .cell */
        let j = 0;
        while (j < document.getElementsByClassName("cell").length) {
            document.getElementsByClassName("cell")[j].addEventListener("click", function() {
                this.classList.add("clicked");
                this.innerHTML = this.dataset.num;

                /* Attempts clicked */
                if (document.getElementsByClassName("clicked").length === 2) {
                    let first = document.getElementsByClassName("clicked")[0];
                    let second = document.getElementsByClassName("clicked")[1];

                    const _expr = parseInt(document.getElementsByClassName("clicked")[0].dataset.num === document.getElementsByClassName("clicked")[1].dataset.num);
                    switch (_expr) {
                    case 1:  // Good
                        /* Change score */
                        data.counter += 1;
                        document.getElementById("attCounter").innerHTML = data.counter;

                        first.remove();
                        second.remove();
                        break;
                    default:  // Bad
                        data.errors += 1;

                        setTimeout(() => {
                            first.innerHTML = " ";
                            second.innerHTML = " ";

                            first.classList.remove("clicked");
                            second.classList.remove("clicked");
                        }, 250);
                        break;
                    }  // document.getElementsByClassName("clicked")[0].dataset.num === document.getElementsByClassName("clicked")[1].dataset.num
                    if ((data.errors == attempts) || (document.getElementsByClassName("cell").length === 0)) // END ?
                        gameOver();
                }  // document.getElementsByClassName("clicked").length === 2
            }, false);
            j++;
        }  // document.getElementsByClassName('cell').length
    }, false);
    i++;
}  // document.getElementsByClassName('menu-item').length

function buildDeck(rows) {
    /* Temporary variables */
    let pics = [];

    let i = rows * rows / 2;
    while (i--) {
        pics[i] = i + 1;
        pics[i + rows * rows / 2] = i + 1;
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
    document.body.style.display = "grid";
    switch (data.difficult) {
    case 4:
        document.body.style.margin = "16em auto";
        document.body.innerHTML = "<div id=deck style=grid-template-columns:repeat(4,1fr);></div>";
        document.body.innerHTML += "<span id=attCounter>0</span>";
        break;
    case 6:
        document.body.style.margin = "10em auto";
        document.body.innerHTML = "<div id=deck style=grid-template-columns:repeat(6,1fr);></div>";
        document.body.innerHTML += "<span id=attCounter>0</span>";
        break;
    case 8:
        document.body.style.margin = "3em auto";
        document.body.innerHTML = "<div id=deck style=grid-template-columns:repeat(8,1fr);></div>";
        document.body.innerHTML += "<span id=attCounter>0</span>";
        break;
    }

    /* Draw cell */
    i = rows * rows;
    while (i--) {
        const space = " ";
        document.getElementById("deck").innerHTML += "<span" + space + "class=cell" + space + "data-num=" + pics[i] + "></span>";
    }
}

function gameOver() {
    document.body.innerHTML = "<div id=result style=grid-template-columns:repeat(1,1fr);>" +
        "<p>difficult:" + data.difficult + "</p>" +
        "<p>errors:" + data.errors + "</p>" +
        "<p>success:" + data.counter + "</p>" +
        "<a href=https://studioofvagueachievments.github.io/sovaopen/ role=button>Go Home</a>" + "</div>";

    document.getElementById("result").style.borderRadius = "1em";


    // document.body.style.display = "flex";
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
