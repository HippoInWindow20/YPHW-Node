const http = require('http')
const fs = require('fs')
const editJsonFile = require("edit-json-file");

const server = http.createServer(function(request, response) {
    console.dir(request.param)

    if (request.method == 'POST') {
        var body = ''
        request.setEncoding("utf8");


        request.on('data', function(data) {
            //When data is received
            body += data
        })
        request.on('end', function() {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            //When receiving finished
            postData = decodeURIComponent(body);
            response.writeHead(200, { 'Content-Type': 'text/html' })
                // response.end(postData)
            var splitted = postData.split("&")
            var splitted2 = []
            for (var x = 0; x < splitted.length; x++) {
                splitted2.push(splitted[x].split("=")[0])
                splitted2.push(splitted[x].split("=")[1])
            }
            if (splitted2[1] == "retrieve") {
                if (checkExist() == false) {
                    response.end("File does not exist");
                } else {
                    fs.readFile(formatDate() + '.json', 'utf8', (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        response.end(data);
                    });
                }

            } else if (splitted2[1] == "save") {
                response.end(writeToJSON(splitted2[3], splitted2[5], splitted2[7]) + "\n Method: Save, Subject: " + splitted2[3] + ", Type: " + splitted2[5] + ", Content: " + splitted2[7])
            } else if (splitted2[1] == "del") {
                response.end(delFromJSON(splitted2[3], splitted2[5], splitted2[7]) + "\n Method: Delete, Subject: " + splitted2[3] + ", Type: " + splitted2[5] + ", Content: " + splitted2[7])
            } else if (splitted2[1] == "reinitialise") {
                reinitialise()
                response.end("Method: Reinitialise at " + new Date().toDateString())
            } else if (splitted2[1] == "listdir") {
                reinitialise()
                response.end("Method: List Directory \n " + listDir())
            }
        })
    } else {
        //GET Request
        var html = `
            <html>
                <head>
                    <title>Node server YPHS-HW</title>
                </head>
                <body>
                    <h1>Node server YPHS-HW</h1>
                    <h3>Ver 1.0 2022-09-29</h3>
                </body>
            </html>`
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.end(html)
    }
})

const port = 3000
server.listen(port)
console.log(`Server successfully started`)



function checkExist() {
    var dec
    if (formatDate().length == 8) {
        if (!fs.existsSync(formatDate() + ".json")) {
            dec = false
        } else {
            dec = true
        }
    }
    return dec

}

function appendZero(number) {
    var store = number.toString()
    if (parseInt(store) < 10 && parseInt(store) >= 0) {
        store = "0" + number.toString()
    } else {}
    return store
}

function formatDate() {
    var date = new Date()
    var year = date.getFullYear()
    var month = appendZero(date.getMonth() + 1)
    var day = appendZero(date.getDate())
    var dateString = year.toString() + month.toString() + day.toString()
    return dateString
}

function writeEmpty() {
    if (checkExist() == false) {
        const content = `{
            "chinese": {
                "hw": [],
                "test": []
            },
            "math": {
                "hw": [],
                "test": []
            },
            "eng": {
                "hw": [],
                "test": []
            },
            "pe": {
                "hw": [],
                "test": []
            },
            "topic": {
                "hw": [],
                "test": []
            },
            "physics": {
                "hw": [],
                "test": []
            },
            "chemistry": {
                "hw": [],
                "test": []
            },
            "biology": {
                "hw": [],
                "test": []
            },
            "geo": {
                "hw": [],
                "test": []
            },
            "earth": {
                "hw": [],
                "test": []
            },
            "history": {
                "hw": [],
                "test": []
            },
            "engcon": {
                "hw": [],
                "test": []
            },
            "defence": {
                "hw": [],
                "test": []
            },
            "cs": {
                "hw": [],
                "test": []
            },
            "other": {
                "hw": [],
                "test": []
            }
        }`

        fs.writeFile(formatDate() + '.json', content, err => {
            if (err) {
                console.error(err)
            }
            // file written successfully
        })
    }
}

writeEmpty()
setInterval(checkExist, 120000)


//parse JSON
function writeToJSON(subject, type, content) {
    try {
        let file = editJsonFile(formatDate() + `.json`)
        if (type == "hw")
            file.append(subject + ".hw", content)
        else if (type == "test")
            file.append(subject + ".test", content)
        file.save()
    } catch (e) {
        return e
    }
}

function delFromJSON(subject, type, content) {
    try {
        let file = editJsonFile(formatDate() + `.json`)
        if (type == "hw")
            file.pop(subject + ".hw", content)
        else if (type == "test")
            file.pop(subject + ".test", content)
        file.save()
    } catch (e) {
        return e
    }
}

function reinitialise() {
    if (checkExist() == true) {
        try {
            fs.unlinkSync(formatDate() + ".json")
            writeEmpty()
        } catch (e) {
            console.log(e)
        }

    }

}

//Manage files
function compareDates(datestring) {
    var datestring1 = new Date(datestring.substring(0, 4), parseInt(datestring.substring(4, 6) - 1), datestring.substring(6, 8))
    var datestring2 = new Date()
    let difference = datestring2.getTime() - datestring1.getTime()
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24))
    return TotalDays
}

function delUnused() {
    var arr = fs.readdirSync(__dirname, { withFileTypes: false })
    for (var i = 0; i < arr.length; i++) {
        if (compareDates(arr[i]) > 10) {
            try {
                fs.unlink(arr[i] + ".json")
            } catch (e) {
                return e
            }
        }
    }
}

setInterval(delUnused, 120000)
delUnused()

function listDir() {
    var y = fs.readdirSync(__dirname)
    var p = ""
    for (var z = 0; z < y.length; z++) {
        p += y[z].toString() + "\n"
    }
    return p
}
