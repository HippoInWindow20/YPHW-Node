process.env.TZ = 'Asia/Taipei'
const http = require('http')
const fs = require('fs')
const editJsonFile = require("edit-json-file");
const path = require('path')

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

            // response.end(postData)
            var splitted = postData.split("&")
            var splitted2 = []
            for (var x = 0; x < splitted.length; x++) {
                splitted2.push(splitted[x].split("=")[0])
                splitted2.push(splitted[x].split("=")[1])
            }
            if (splitted2[1] == "retrieve") {
                if (checkExist() == false) {
                    response.end("File does not exist")
                } else {
                    fs.readFile('db/' + formatDate() + '.json', 'utf8', (err, data) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        response.writeHead(200, { 'Content-Type': 'application/json' })
                        response.end(data)
                    })
                }

            } else if (splitted2[1] == "save") {
                response.writeHead(200, { 'Content-Type': 'text/plain' })
                writeToJSON(splitted2[3], splitted2[5], splitted2[7], splitted2[9])
                response.end("Method: Save, Subject: " + splitted2[3] + ", Type: " + splitted2[5] + ", Content: " + splitted2[7])
            } else if (splitted2[1] == "del") {
                response.writeHead(200, { 'Content-Type': 'text/plain' })
                delFromJSON(splitted2[3], splitted2[5], splitted2[7])
                response.end("Method: Delete, Subject: " + splitted2[3] + ", Type: " + splitted2[5] + ", Content: " + splitted2[7])
            } else if (splitted2[1] == "reinitialise") {
                reinitialise()
                response.writeHead(200, { 'Content-Type': 'text/plain' })
                response.end("Method: Reinitialisation at " + new Date().toDateString())
            } else if (splitted2[1] == "listdir") {
                response.writeHead(200, { 'Content-Type': 'text/plain' })
                response.end("Method: List Directory \n" + listDir())
            } else if (splitted2[1] == "previous") {

                var pathDB = path.join(__dirname, '/db')
                var y = fs.readdirSync(pathDB)
                var arr = []
                for (var x = 0; x < y.length; x++) {
                    if (path.extname(y[x]) == ".json") {
                        arr.push(y[x])
                    }
                }
                var arr2 = []
                if (arr.length < 10) {
                    for (var k = arr.length - 1; k >= 0; k--) {
                        arr2[arr.length - k - 1] = arr[k]
                    }
                } else {
                    for (var k = arr.length - 1; k >= arr.length - 10; k--) {
                        arr2[arr.length - k - 1] = arr[k]
                    }
                }
                var respp
                if (splitted2[5].toString() == "false") {
                    try {
                        response.writeHead(200, { 'Content-Type': 'application/json' })
                        respp = fs.readFileSync('db/' + arr2[splitted2[3]], 'utf8', (err, data) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                            return data
                        })
                    } catch (e) {
                        console.log("Invalid Index: " + e)
                    }
                } else if (splitted2[5].toString() == "true") {
                    response.writeHead(200, { 'Content-Type': 'text/plain' })
                    var p = ""
                    for (var z = 0; z < arr2.length; z++) {
                        p += arr2[z].toString() + "\n"
                    }
                    respp = p
                }
                response.end(respp)
            } else if (splitted2[1] == "copytotoday") {
                response.writeHead(200, { 'Content-Type': 'text/plain' })
                var res = copyPreviousToCurrent()
                response.end(res)
            } else {
                response.writeHead(200, { 'Content-Type': 'text/plain' })
                response.end("Error: Invalid Request")
            }
        })
    } else {
        //GET Request
        var html = `
            <html>
                <head>
                    <title>Node server YPHS-HW</title>
                    <meta charset='utf-8'>
                </head>
                <body style='font-family: sans-serif'>
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
                    <h1>Node server YPHS-HW</h1>
                    <h3 style='color: blue'>Ver 1.1 2022-10-1</h3>
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
        if (!fs.existsSync('db/' + formatDate() + ".json")) {
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

        fs.writeFile('db/' + formatDate() + '.json', content, err => {
            if (err) {
                console.error(err)
            }
            // file written successfully
        })
    }
}
delUnused()

writeEmpty()
setInterval(checkExist, 120000)


//parse JSON
function writeToJSON(subject, type, content, expDate) {
    try {
        let file = editJsonFile('db/' + formatDate() + `.json`)
        if (Date.parse(expDate) != NaN)
            expDate = new Date(expDate) + ""
        if (type == "hw") {
            if (expDate != NaN) {
                file.append(subject + ".hw", [content, expDate])
            } else {
                file.append(subject + ".hw", [content, ""])
            }
        } else if (type == "test") {
            if (expDate) {
                file.append(subject + ".test", [content, expDate])
            } else {
                file.append(subject + ".test", [content, ""])
            }
        }
        file.save()
    } catch (e) {
        return e
    }
}

function delFromJSON(subject, type, content, expDate) {
    try {
        let file = editJsonFile('db/' + formatDate() + `.json`)
        if (Date.parse(expDate) != NaN)
            expDate = new Date(expDate) + ""
        if (type == "hw") {
            if (expDate != NaN) {
                file.pop(subject + ".hw", [content, expDate])
            } else {
                file.pop(subject + ".hw", [content, ""])
            }
        } else if (type == "test")
            if (expDate != NaN) {
                file.pop(subject + ".test", [content, expDate])
            } else {
                file.pop(subject + ".test", [content, ""])
            }
        file.save()
    } catch (e) {
        return e
    }
}

function reinitialise() {
    if (checkExist() == true) {
        try {
            fs.unlinkSync('db/' + formatDate() + ".json")
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
    var arr = fs.readdirSync(path.join('db'), { withFileTypes: false })
    for (var i = 0; i < arr.length; i++) {
        if (compareDates(arr[i]) > 10) {
            try {
                fs.unlinkSync("db/" + arr[i])
            } catch (e) {
                console.error(e)
            }
        }
    }
}

setInterval(delUnused, 1000)


function listDir() {
    var y = fs.readdirSync(path.join(__dirname, '/db'))
    var p = ""
    for (var z = 0; z < y.length; z++) {
        p += y[z].toString() + "\n"
    }
    return p
}

function copyPreviousToCurrent() {
    var pathDB = path.join(__dirname, '/db')
    var y = fs.readdirSync(pathDB)
    var arr = []
    for (var x = 0; x < y.length; x++) {
        if (path.extname(y[x]) == ".json") {
            arr.push(y[x])
        }
    }
    var arr2 = []

    for (var k = arr.length - 1; k >= arr.length - 10; k--) {
        arr2[arr.length - k - 1] = arr[k]
    }
    var respp
    try {
        respp = fs.readFileSync('db/' + arr2[1], 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            return data
        })
    } catch (e) {
        console.log("Invalid Index: " + e)
    }
    fs.writeFile('db/' + formatDate() + '.json', respp, err => {
        if (err) {
            console.error(err)
        }
    })
    return "Copied " + arr2[1] + " to " + formatDate() + ".json"
}