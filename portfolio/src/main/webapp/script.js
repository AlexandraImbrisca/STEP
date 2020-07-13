var buttonOn = false;

function flipFunction() {
    var row = document.getElementById("row");
    var columns = document.getElementsByClassName("column");
    var maxSize = 75;
    var size = maxSize / columns.length + "%";
    if (!buttonOn) {
        buttonOn = true;
        row.style.display = "flex";
        row.style.justifyContent = "center";
        for (var i = 0; i < columns.length; i++) {
            columns[i].style.margin = 0;
            columns[i].style.flex = size;
            columns[i].style.maxWidth = size;
        }
    } else {
        buttonOn = false;
        row.style.display = "none";
    }
}