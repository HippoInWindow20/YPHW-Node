var collapsed = true

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

function showDialog() {
    $("#overlay").fadeIn(300)
    $("#details").fadeIn(300)
    document.getElementById("details").style.top = "calc(50% - " + (document.getElementById("details").getBoundingClientRect().height / 2) + "px)"
}