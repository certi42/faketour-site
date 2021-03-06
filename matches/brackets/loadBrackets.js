const formats = ["constructed", "limited"];
loadData();

async function loadData() {
    let data = await fetch("getMatches.php");
    let response = await data.text();
    if(response !== "0 results") {
        createMatches(response);
    }
    else {
        for(format of formats) {
            let formatBox = document.getElementById(format + "_matches");
            let message = document.createElement("h3");
            message.innerHTML += "No " + format + " matches";
            formatBox.appendChild(message);
        }
    }
}

function createMatches(data) {
    let matches = JSON.parse(data);
    for(format of formats) {
        let formatBox = document.getElementById(format + "_matches");
        for(round in matches[format]) {
            let roundBox = document.createElement("div");
            roundBox.classList.add("round")
            let title = document.createElement("h3");
            if(isNaN(round)) {
                title.innerHTML = round;
            }
            else {
                title.innerHTML = "Round " + round;
            }
            roundBox.appendChild(title);
            for(match of matches[format][round]) {
                if(match.playerTwo == "") {
                    match.playerTwo = "Bye"
                }

                let score = match.record.split("-");
                let winner;
                if(score.length == 2) {
                    winner = score[0] > score[1] ? match.playerOne : match.playerTwo;
                } else {
                    winner = "none";
                    score[0] = "0";
                    score[1] = "0"
                }

                let matchBox = document.createElement("table");
                let oneBox = document.createElement("td");
                oneBox.classList.add("player")
                if(winner == match.playerOne) {
                    oneBox.classList.add("winner");
                }
                oneBox.innerHTML += match.playerOne;

                let twoBox = document.createElement("td");
                twoBox.classList.add("player")
                if(winner == match.playerTwo) {
                    twoBox.classList.add("winner");
                }
                twoBox.innerHTML += match.playerTwo;

                let scoreOne = document.createElement("td");
                scoreOne.classList.add("score");
                scoreOne.classList.add("top");
                scoreOne.innerHTML = score[0];
                let scoreTwo = document.createElement("td");
                scoreTwo.classList.add("score");
                scoreTwo.classList.add("bottom");
                scoreTwo.innerHTML = score[1];

                if(winner == match.playerOne) {
                    scoreOne.classList.add("winner");
                } else if(winner == match.playerTwo) {
                    scoreTwo.classList.add("winner");
                }

                let rowOne = document.createElement("tr");
                rowOne.appendChild(oneBox);
                oneBox.classList.add("split");
                rowOne.appendChild(scoreOne);
                let rowTwo = document.createElement("tr");
                rowTwo.appendChild(twoBox);
                rowTwo.appendChild(scoreTwo);
                matchBox.appendChild(rowOne);
                matchBox.appendChild(rowTwo);
                let borderBox = document.createElement("div");
                borderBox.classList.add("match");
                borderBox.appendChild(matchBox);
                roundBox.appendChild(borderBox);
            }
            formatBox.appendChild(roundBox);
        }
    }
}