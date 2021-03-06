function showModal() {
    document.getElementById("import-deck").style.display = "block";
}

window.onclick = function(event) {
    let modals = document.getElementsByClassName('modal');
    let dismiss = false;
    if(event == null) {
        event = new MouseEvent(null);
        dismiss = true;
    }
    for(modal of modals) {
        if (event.target == modal || dismiss) {
            modal.style.display = "none";
        }
    }
}

function importDeck() {
    if(!readURL()) {
        if(!readFile()) {
            showAlert("No deck", "Found nothing to import", "warning");
        }
    }
}

function loadDeck(text) {
    maindeck.value = "";
    sideboard.value = "";
    let inSideboard = false;
    let lines = text.split("\n");
    let linesIgnored = 0;
    document.getElementById("sideboard").value = "";
    for(line of lines) {
        line = line.trim();
        if(line == "" && !inSideboard) {
            inSideboard = true;
        } else if(!isNaN(line.charAt(0))) {
            if(inSideboard) {
                sideboard.value += line + "\n";
            }
            else {
                maindeck.value += line + "\n";
            }
        } else if(!line.startsWith("//") && !line.startsWith("#")) {
            linesIgnored ++;
        }
    }
    if(linesIgnored == 1) {
        showAlert("Some lines ignored", "Ignored 1 line of the input", "warning");
    }
    else if(linesIgnored != 0) {
        showAlert("Some lines ignored", "Ignored " + linesIgnored + " lines of the input", "warning");
    }
    if(inSideboard == false) {
        showAlert("Maindeck imported", "No sideboard was detected", "warning");
    }
    document.getElementById("import-deck").style.display = "none";
}

function readURL() {
    let urlSelector = document.getElementById("url");
    try {
        let url = new URL(urlSelector.value);
        let host = "";
        if(url.host.includes("mtggoldfish.com")) {
            host = "m"
        } else if(url.host.includes("tappedout.net")) {
            host = "t";
        } else if(url.host.includes("deckstats.net")) {
            host = "d";
        } else if(url.host.includes("scryfall.com")) {
            host = "s";
        }
        if(host == "") {
            showAlert("Invalid URL", "We don't support importing decks from " + url.host, "error");
        } else {
            showAlert("Loading Deck", "Importing decklist from " + urlSelector.value, "info");
            if(host == "s") {
                let deckId = url.href.split("/")[5];
                fetch("https://api.scryfall.com/decks/" + deckId + "/export/text")
                .then(response => {
                    if(response.ok) {
                        return response.text();
                    } else {
                        response.text();
                        throw new Error("Failed to get deck");
                    }
                })
                .then(loadDeck)
                .catch(() => {
                    showAlert("Invalid URL", "Couldn't read a decklist from the provided url");
                });
            } else {
                fetch("readDeck.php?mode=" + host + "&url=" + url.href)
                .then(response => response.text())
                .then(response => {
                    if(response == "Invalid URL mode") {
                        showAlert("Invalid URL", "We don't support importing decks from " + url.host, "error");
                    } else {
                        loadDeck(response);
                    }
                });
            }
        }
        return true;
    } catch(e) {
        if(urlSelector.value != "") {
            showAlert("Invalid URL", "A valid URL wasn't able to be interpreted", "error");
            console.error(e);
        }
        return false;
    }
}

function readFile() {
    let fileSelector =  document.getElementById("files");
    if(fileSelector.files.length == 0) {
        return false;
    }
    let file = files.files[0];
    if (!file.type.match('text.*')) {
        return;
    }
    let reader = new FileReader();
    reader.onload = function(f) {
        let deckString = f.target.result;
        while(deckString.includes("\r")) {
            deckString = deckString.replace("\r", "");
        }
        loadDeck(deckString);
    }
    reader.readAsText(file);
    return true;
}