var isLocal = false
var url
if (isLocal == true) {
    url = "http://localhost:3000"
} else {
    url = "https://yphw-node.onrender.com/"
}
//Server implements JQuery library by default

function retrieveToday() {
    var xmlhttp = new XMLHttpRequest();
    var theUrl = "http://localhost:3000";
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "retrieve" }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // res = xmlhttp.responseText.replace("\n", "")
            // res = res.replace("\r", "")
            $("#result").html(xmlhttp.responseText);
        }
    };
}

function copyToToday() {
    var xmlhttp = new XMLHttpRequest();
    var theUrl = "http://localhost:3000";
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "copytotoday" }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            $("#result").html(xmlhttp.responseText);
        }
    };
}

function saveData(subject, type, content, expDate) {
    if (expDate) {} else {
        expDate = ""
    }
    var xmlhttp = new XMLHttpRequest();
    var theUrl = "http://localhost:3000";
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "save", "subject": subject, "type": type, "content": content, "expDate": expDate }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            $("#result").html(xmlhttp.responseText);
        }
    };
}

function delData(subject, type, content, expDate) {
    if (expDate) {} else {
        expDate = ""
    }
    var xmlhttp = new XMLHttpRequest();
    var theUrl = "http://localhost:3000";
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "del", "subject": subject, "type": type, "content": content, "expDate": expDate }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            $("#result").html(xmlhttp.responseText);
        }
    };
}

function reinitialise() {
    var xmlhttp = new XMLHttpRequest();
    var theUrl = "http://localhost:3000";
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "reinitialise" }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            $("#result").html(xmlhttp.responseText);
        }
    };
}

function listDir() {
    var xmlhttp = new XMLHttpRequest();
    var theUrl = "http://localhost:3000";
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "listdir" }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            $("#result").html(xmlhttp.responseText);
        }
    };
}

function retrievePrevious(index, listall) {
    var xmlhttp = new XMLHttpRequest();
    var theUrl = "http://localhost:3000";
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "previous", "index": index, "listall": listall }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            $("#result").html(xmlhttp.responseText)
        }
    };
}

//Process data
function getContents(subject, type) {

    var xmlhttp = new XMLHttpRequest();
    var theUrl = "http://localhost:3000";
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "function": "retrieve" }));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // res = xmlhttp.responseText.replace("\n", "")
            // res = res.replace("\r", "")
            $("#result").html(JSON.parse(xmlhttp.responseText)[subject][type]);
        }
    };
}