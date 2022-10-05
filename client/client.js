var isLocal = false
var theUrl
if (isLocal == true) {
    theUrl = "http://localhost:3000"
} else {
    theUrl = "https://yphw-node.shippohsu.repl.co/"
}
//Server implements JQuery library by default
var success = false;

function retrieveToday() {
    try {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.open("POST", theUrl);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify({ "function": "retrieve" }));
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (xmlhttp.responseText !== "File does not exist") {
                    cache = JSON.parse(xmlhttp.responseText)
                    success = true
                } else {
                    copyToToday()
                    reinitialise()
                    retrieveToday()
                }
            }
        };
    } catch (e) {}
}

function copyToToday() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "copytotoday" }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xmlhttp.responseText)
        }
    };
}

function saveData(subject, type, content, expDate) {
    if (expDate) {} else {
        expDate = ""
    }
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "save", "subject": subject, "type": type, "content": content, "expDate": expDate }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xmlhttp.responseText)
        }
    };
}

function delData(subject, type, content, expDate) {
    if (expDate) {} else {
        expDate = ""
    }
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "del", "subject": subject, "type": type, "content": content, "expDate": expDate }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xmlhttp.responseText)
        }
    };
}

function reinitialise() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "reinitialise" }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xmlhttp.responseText)
        }
    };
}

function listDir() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "listdir" }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xmlhttp.responseText)
        }
    };
}

function retrievePrevious(index, listall) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "previous", "index": index, "listall": listall }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            return JSON.parse(xmlhttp.responseText)
        }
    };
}

//Process data
function getContents(subject, type) {

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "retrieve" }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // res = xmlhttp.responseText.replace("\n", "")
            // res = res.replace("\r", "")
            return JSON.parse(xmlhttp.responseText)[subject][type]
        }
    };
}