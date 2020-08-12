/* JSON Result */
var data = {
    difficult: 0,
    errors: 0,
    counter: 0
};

/* Event Click To .menu-item */
for (const item of document.getElementsByClassName("menu-item")) {
    item.addEventListener("click", () => {
        document.querySelector("#menu").style.display = "none";

        data.difficult = parseInt(item.dataset.lvl);
        const attempts = parseInt(item.dataset.attempts);

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
        for (const cell of document.getElementsByClassName("cell")) {
            cell.addEventListener("click", () => {
                cell.classList.add("clicked");
                cell.innerHTML = cell.dataset.num;

                /* Attempts clicked */
                if (document.getElementsByClassName("clicked").length === 2) {
                    let first = document.getElementsByClassName("clicked")[0];
                    let second = document.getElementsByClassName("clicked")[1];

                    const _expr = Number(first.dataset.num === second.dataset.num);
                    switch (_expr) {
                    case 1:  // Good
                        /* Change score */
                        data.counter += 1;
                        document.querySelector("#attCounter").innerHTML = data.counter;

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
        }  // document.getElementsByClassName('cell')
    }, false);
}  // document.getElementsByClassName('menu-item')

const buildDeck = (rows) => {
    /* Temporary variables */
    let pics = [];

    let i = rows * rows / 2;
    while (i--) {
        pics[i] = i + 1;
        pics[i + ((rows * rows) / 2)] = i + 1;
    }

    /* Randomizing */
    i = rows * rows;
    while (i--) {
        const rand = getRandom(rows * rows / 2);
        const temp = pics[i];
        pics[i] = pics[rand];
        pics[rand] = temp;
    }

    /* Styling */
    const body = document.querySelector("body");
    body.style.display = "grid";
    switch (data.difficult) {
    case 4:
        body.style.margin = "16em auto";
        body.innerHTML = "<div id=deck style=grid-template-columns:repeat(4,1fr);></div>";
        break;
    case 6:
        body.style.margin = "10em auto";
        body.innerHTML = "<div id=deck style=grid-template-columns:repeat(6,1fr);></div>";
        break;
    case 8:
        body.style.margin = "3em auto";
        body.innerHTML = "<div id=deck style=grid-template-columns:repeat(8,1fr);></div>";
        break;
    }

    body.innerHTML += "<span id=attCounter>0</span>";


    /* Draw cell */
    const deck = document.querySelector("#deck");
    i = rows * rows;
    while (i--) {
        const space = " ";
        deck.innerHTML += "<span" + space + "class=cell" + space + "data-num=" + pics[i] + "></span>";
    }
};

const gameOver = () => {
    document.body.innerHTML = "<div id=result style=grid-template-columns:1fr;>" +
        "<p>difficult:" + data.difficult + "</p>" +
        "<p>errors:" + data.errors + "</p>" +
        "<p>success:" + data.counter + "</p>" +
        "<a href=https://studioofvagueachievments.github.io/sovaopen/ role=button>Go Home</a>" + "</div>";

    document.querySelector("#result").style.borderRadius = "1em";


    // document.body.style.display = "flex";
};

const getRandom = (x) => Math.floor(Math.random() * x);
