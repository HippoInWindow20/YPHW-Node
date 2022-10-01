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
        return result
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
        console.log(result)
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
        console.log(result)
    });
}

function reinitialise() {
    $.post(url, {
        function: "reinitialise"
    }, function(result) {
        console.log(result)
    });
}

function listDir() {
    $.post(url, {
        function: "listdir"
    }, function(result) {
        return result
    });
}

function retrievePrevious(index, listall) {
    if (listall) {
        index = ""
    }
    $.post(url, {
        function: "previous",
        index: index,
        listall: listall
    }, function(result) {
        if (listall)
            console.log(result)
        else
            return result
    });
}