let deckData;
let decklist = {};
let standardLegal;
logIn();
let event;

getDataWait("cards.json", function(response) {
    standardLegal = JSON.parse(response);
    if(deckData != undefined) {
        createDecklist();
    }
});

function logIn() {
    getDataWait("/php/loggedIn.php?page=submit_constructed", function(response) {
        let hasDeck = false;
        if(response != "true" && response != "false") {
            response = response.substring(1,response.length-1);
            hasDeck = true;
        }
        let responseJSON = JSON.parse(response);
        if(hasDeck) {
            deckData = responseJSON;
        } else {
            let text = "Submit you deck to see it here";
            if(responseJSON == false) {
                text = "You need to be logged in to see your deck";
            }
            let message = document.createElement("h2");
            message.innerHTML = text;
            document.getElementById("bg").appendChild(message);
        }

        if(standardLegal != undefined) {
            createDecklist();
        }
    });
}

function getLineInfo(line) {
    let elements = line.split(' ');
    let count = 1;
    let name = line;
    if(!isNaN(elements[0])) {
        count = Number(elements[0]);
        elements.splice(0, 1);
        name = elements.join(' ');
    }

    return [name, count];
}

function createDecklist() {
    for(line of deckData.maindeck) {
        let data = getLineInfo(line);
        let name = data[0];
        let count = data[1];
        let type = standardLegal[name].type;
        if(!decklist.hasOwnProperty(type)) {
            decklist[type] = [];
        }
        decklist[type].push({
            "count": count,
            "name": name,
            "image_uri": standardLegal[name].image_uri
        });
    }

    decklist.Sideboard = [];
    for(line of deckData.sideboard) {
        let data = getLineInfo(line);
        let name = data[0];
        let count = data[1];
        decklist.Sideboard.push({
            "name": name,
            "count": count,
            "image_uri": standardLegal[name].image_uri
        });
    }

    document.getElementById("bg").appendChild(createDeckView(decklist));
}


function createDeckView(decklist) {
    let sideboard = decklist.Sideboard;
    delete decklist.Sideboard;
    let rowOnes = [], rowTwos = [], rowOneTotal = 0, rowTwoTotal = 0, rows = []; 
    for(key of Object.keys(decklist).reverse()) {
        rows.push({"count": decklist[key].length, "name": key});
    }
    rows.sort(function(a, b) {
        return b.count - a.count;
    });

    while(rows.length > 0) {
        let current = rows[0]
        if(rowOneTotal <= rowTwoTotal) {
            rowOnes.push(current);
            rowOneTotal += current.count + 4;
        }
        else {
            rowTwos.push(current);
            rowTwoTotal += current.count + 4;
        }
        rows.splice(0, 1);
    }

    let rowOne = document.createElement("div");
    for(item of rowOnes) {
        rowOne.appendChild(createRow(item.name, decklist));
    }

    let rowTwo = document.createElement("div");
    for(item of rowTwos) {
        rowTwo.appendChild(createRow(item.name, decklist));
    }

    let rowThree = document.createElement("div");
    decklist["Sideboard"] = sideboard;
    rowThree.appendChild(createRow("Sideboard", decklist));

    rowOne.classList.add("row");
    rowTwo.classList.add("row");
    rowThree.classList.add("row");

    let deck = document.createElement("div");
    deck.classList.add("deck");
    deck.appendChild(rowOne);
    deck.appendChild(rowTwo);
    deck.appendChild(rowThree);
    return deck;
}

function createRow(name, decklist) {
    let type = document.createElement("div");
    type.classList.add("type");
    let title = document.createElement("h3");
    title.innerHTML = name;
    type.appendChild(title);
    let count = 0;
    for(card of decklist[name]) {
        let cardLine = document.createElement("p");
        cardLine.classList.add("card-line");
        cardLine.innerHTML = card.count + " " + card.name;
        let preview = document.createElement("img");
        preview.classList.add("card-preview");
        preview.src = card.image_uri;
        cardLine.addEventListener('mouseover', function(e) {
            preview.style.display = "inline";
            preview.style.left = e.pageX;
            preview.style.top = normalizePreviewY(e, preview);
            event = e;
            console.log(e);
        });
        cardLine.addEventListener('mouseleave', function(e) {
            preview.style.display = "none";
        });
        cardLine.onmousemove = function(e) {
            preview.style.left = e.pageX;
            preview.style.top = normalizePreviewY(e, preview);
        }
        type.appendChild(cardLine);
        type.appendChild(preview);
        count += card.count;
    }
    title.innerHTML += " (" + count + ") <br>";
    return type;
}

function normalizePreviewY(e, preview) {
    let newY = e.pageY;
    if(newY + preview.height > window.innerHeight) {
        newY = window.innerHeight - preview.height;
    }
    return newY;
}