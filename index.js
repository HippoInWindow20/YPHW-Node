process.env.TZ = 'Asia/Taipei'
process.env.url = "student.yphs.tp.edu.tw"
process.env.user = "za10755143"
process.env.pw = "z940918"
process.env.secure = false
const http = require('http')
const fs = require('fs')
const editJsonFile = require("edit-json-file");
const path = require('path')
    // const ftpdump = require("ftpdump");
const dFtp = require('dump-ftp');
const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

var downloadStarted = null
var downloadEnded = null
var uploadStarted = null
var uploadEnded = null

const server = http.createServer(function(request, response) {
    // console.dir(request.param)
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', '*');
    if (request.method == 'POST') {
        var body = ''
        request.setEncoding("utf8");


        request.on('data', function(data) {
            //When data is received
            body += data
        })
        request.on('end', function() {

            //When receiving finished
            postData = JSON.parse(body);

            if (postData.function == "retrieve") {
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

            } else if (postData.function == "save") {
                response.writeHead(200, { 'Content-Type': 'text/plain' })
                writeToJSON(postData.subject, postData.type, postData.content, postData.expDate)
                response.end("Method: Save, Subject: " + postData.subject + ", Type: " + postData.type + ", Content: " + postData.content)
            } else if (postData.function == "del") {
                response.writeHead(200, { 'Content-Type': 'text/plain' })
                delFromJSON(postData.subject, postData.type, postData.content)
                response.end("Method: Delete, Subject: " + postData.subject + ", Type: " + postData.type + ", Content: " + postData.content)
            } else if (postData.function == "reinitialise") {
                reinitialise()
                response.writeHead(200, { 'Content-Type': 'text/plain' })
                response.end("Method: Reinitialisation at " + new Date().toDateString())
            } else if (postData.function == "listdir") {
                response.writeHead(200, { 'Content-Type': 'text/plain' })
                response.end("Method: List Directory \n" + listDir())
            } else if (postData.function == "previous") {

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
                if (postData.listall.toString() == "false") {
                    try {
                        response.writeHead(200, { 'Content-Type': 'application/json' })
                        respp = fs.readFileSync('db/' + arr2[postData.index], 'utf8', (err, data) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                            return data
                        })
                    } catch (e) {
                        console.log("Invalid Index: " + e)
                    }
                } else if (postData.listall.toString() == "true") {
                    response.writeHead(200, { 'Content-Type': 'text/plain' })
                    var p = ""
                    for (var z = 0; z < arr2.length; z++) {
                        p += arr2[z].toString() + "\n"
                    }
                    respp = p
                }
                response.end(respp)
            } else if (postData.function == "copytotoday") {
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
                    <h3 style='color: green'>Ver 1.2 2022-10-2</h3>
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
    downloadSyncWithFTP()
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
    uploadSyncWithFTP()
}
delUnused()

//writeEmpty()
setInterval(checkExist, 5000)


//parse JSON
function writeToJSON(subject, type, content, expDate) {
    downloadSyncWithFTP()
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
    uploadSyncWithFTP()
}

function delFromJSON(subject, type, content, expDate) {
    downloadSyncWithFTP()
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
    uploadSyncWithFTP()
}

function reinitialise() {
    downloadSyncWithFTP()
    if (checkExist() == true) {
        try {
            fs.unlinkSync('db/' + formatDate() + ".json")
            writeEmpty()
        } catch (e) {
            console.log(e)
        }

    }
    uploadSyncWithFTP()
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
    downloadSyncWithFTP()
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
    uploadSyncWithFTP()
}

setInterval(delUnused, 120000)


function listDir() {
    downloadSyncWithFTP()
    var y = fs.readdirSync(path.join(__dirname, '/db'))
    var p = ""
    for (var z = 0; z < y.length; z++) {
        p += y[z].toString() + "\n"
    }
    return p
}

function copyPreviousToCurrent() {
    downloadSyncWithFTP()
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
    uploadSyncWithFTP()
    return "Copied " + arr2[1] + " to " + formatDate() + ".json"
}


/*

TODO: Migrate current File System functions to FTP-Based

*/

function uploadSyncWithFTP() {
    var config = {
        user: process.env.user, // NOTE that this was username in 1.x 
        password: process.env.pw, // optional, prompted if none given
        host: process.env.url,
        port: 21,
        localRoot: __dirname + '/db',
        remoteRoot: 'db/',
        include: ['*'], // this would upload everything except dot files
        exclude: [], // e.g. exclude sourcemaps - ** exclude: [] if nothing to exclude **
        deleteRemote: false, // delete ALL existing files at destination before uploading, if true
        forcePasv: true // Passive mode is forced (EPSV command is not sent)
    }


    // use with callback
    ftpDeploy.deploy(config, function(err, res) {
        if (err) console.log(err)
        else console.log('finished:', res);
    });
}

function downloadSyncWithFTP() {
    // new ftpdump({
    //     host: process.env.url,
    //     port: 21,
    //     user: process.env.user,
    //     password: process.env.pw,
    //     root: "db"
    // }, "/db", function(err) {
    //     if (err) return console.log(err);
    // })
    var connection = {
        host: process.env.url,
        port: 21,
        user: process.env.user,
        password: process.env.pw,
        root: 'db'
    };

    var dump = new dFtp(connection).dump();
}