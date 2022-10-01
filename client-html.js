var isLocal = true
var url
if (isLocal == true) {
    url = "http://localhost:3000"
} else {
    url = "https://yphw-node.onrender.com/"
}

//Server implements JQuery library by default

function retrieveToday() {
    $.post(url, {
        function: "retrieve"
    }, function(result) {
        $("#result").html(JSON.stringify(result))
    });
}

function copyToToday() {
    $.post(url, {
        function: "copytotoday"
    }, function(result) {
        $("#result").html(result)
    });
}

function saveData(subject, type, content, expDate) {
    if (expDate) {} else {
        expDate = ""
    }
    $.post(url, {
        function: "save",
        subject: subject,
        type: type,
        content: content,
        expDate: expDate
    }, function(result) {
        $("#result").html(result)
    });
}

function delData(subject, type, content, expDate) {
    if (expDate) {} else {
        expDate = ""
    }
    $.post(url, {
        function: "del",
        subject: subject,
        type: type,
        content: content,
        expDate: expDate
    }, function(result) {
        $("#result").html(result)
    });
}

function reinitialise() {
    $.post(url, {
        function: "reinitialise"
    }, function(result) {
        $("#result").html(result)
    });
}

function listDir() {
    $.post(url, {
        function: "listdir"
    }, function(result) {
        $("#result").html(result)
    });
}

function retrievePrevious(index, listall) {
    $.post(url, {
        function: "previous",
        index: parseInt(index),
        listall: listall
    }, function(result) {
        if (listall.toString() == "true")
            $("#result").html(result)
        else
            $("#result").html(JSON.stringify(result))
    });
}

//Process data
function getContents(subject, type) {

    $.post(url, {
        function: "retrieve"
    }, function(result) {
        $("#result").html(JSON.stringify(result[subject][type]))
    });
}