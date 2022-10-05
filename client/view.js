var collapsed = true
var subject = ["chinese", "math", "eng", "pe", "topic", "physics", "chemistry", "biology", "geo", "earth", "history", "engcon", "defence", "cs", "other"]

function collapseAll() {
    var x = document.getElementsByClassName("item");
    if (collapsed == false) {
        for (var y = 0; y < x.length; y++) {
            $(x[y]).slideUp(250, "swing");
        }
        collapsed = true
        document.getElementById("colIcon").innerHTML = "unfold_more"
    } else {
        for (var y = 0; y < x.length; y++) {
            $(x[y]).slideDown(250, "swing");
        }
        collapsed = false
        document.getElementById("colIcon").innerHTML = "unfold_less"
    }
}

function dismissDialog() {
    $("#overlay").fadeOut(300)
    $("#details").fadeOut(300)
}

function showDialog(subjectCH, subject) {
    document.getElementById("listHW").innerHTML = ""
    document.getElementById("listTest").innerHTML = ""
    $("#overlay").fadeIn(300)
    $("#details").fadeIn(300)
    document.getElementById("innerSubject").innerHTML = subjectCH
    var hw = cache[subject].hw
    var test = cache[subject].test
    if (hw.length !== 0 || test.length !== 0) {
        for (var h = 0; h < hw.length; h++) {

            if (hw[h][1] !== "Invalid Date") {
                var date = new Date(hw[h][1])
                document.getElementById("listHW").innerHTML += "<li><div class='liMain'>" + hw[h][0] + "</div><div class='liDate'>日期: " + parseInt(date.getMonth() + 1) + "/" + date.getDate() + "</div></li>"
            } else {
                document.getElementById("listHW").innerHTML += "<li><div class='liMain'>" + hw[h][0] + "</div></li>"
            }

        }
        for (var j = 0; j < test.length; j++) {
            if (test[j][1] !== "Invalid Date") {
                var date = new Date(test[j][1])
                document.getElementById("listTest").innerHTML += "<li><div class='liMain'>" + test[j][0] + "</div><div class='liDate'>日期: " + parseInt(date.getMonth() + 1) + "/" + date.getDate() + "</div></li>"
            } else {
                document.getElementById("listTest").innerHTML += "<li><div class='liMain'>" + test[j][0] + "</div></li>"
            }
        }
    } else {
        document.getElementById("listHW").innerHTML = "<li><div class='liMain'>沒有功課</div></li>"
        document.getElementById("listTest").innerHTML = "<li><div class='liMain'>沒有考試</div></li>"
    }
    document.getElementById("details").style.top = "calc(50% - " + (document.getElementById("details").getBoundingClientRect().height / 2) + "px)"
}

var cache
$("#overlay").show()
$("#placeholder").show()
document.getElementById("placeholder").style.top = "calc(50% - " + (document.getElementById("placeholder").getBoundingClientRect().height / 2) + "px)"

var y = document.getElementsByClassName("subjectBlock")
for (var z = 0; z < y.length; z++) {
    y[z].onclick = function() { showDialog(this.childNodes[1].innerHTML, this.childNodes[3].id) }
}

var Query = setInterval(retrieveToday, 2000);
var y = setInterval(function() {
    if (success) {
        $("#overlay").fadeOut(300)
        $("#placeholder").fadeOut(300)
        clearInterval(Query)
        for (var i = 0; i < subject.length; i++) {
            countItems(cache, subject[i])
            enterList(cache, subject[i])
        }
        clearInterval(y)
    }
}, 1000)

function countItems(json, subject) {
    var temp = json[subject]
    document.getElementById(subject).innerHTML = temp.hw.length + "項功課 · " + temp.test.length + "項考試"
    if (temp.hw.length == 0 && temp.test.length == 0)
        document.getElementById(subject).parentNode.style.display = "none"
}

function enterList(json, subject) {
    var temp = json[subject].hw
    for (var x = 0; x < temp.length; x++) {
        document.getElementById(subject).parentNode.innerHTML += "<div class='item'>" + temp[x][0] + "</div>"
    }
}