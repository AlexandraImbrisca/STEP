var galleryOn = false;
var gallerySizePercent = 75;

var darkModeOn = false;
var darkBackgroundColor = "#13293D";
var darkButtonBackgroundColor = "#2A628F";

var brightButtonBackgroundColor = "#3E92CC";

var windowWidth = window.outerWidth;

function computeWindowSize(windowWidth) {
    var initialSize = gallerySizePercent;
    if (windowWidth < 600) {
        initialSize *= 4;
    } else if (windowWidth < 800) {
        initialSize *= 2;
    }
    return initialSize;
}

function recomputeWindowWidth() {
    var newWindowWidth = window.outerWidth;
    if (newWindowWidth == windowWidth) {
        return;
    }
    var newGallerySize = computeWindowSize(newWindowWidth);
    scaleColumns(newGallerySize);
}

function scaleColumns(gallerySize) {
    var columns = document.getElementsByClassName("column");
    var columnSize = gallerySize / columns.length + "%";
        
    for (var i = 0; i < columns.length; i++) {
        columns[i].style.flex = columnSize;
        columns[i].style.maxWidth = columnSize;
    }
}

function showGallery() {
    var gallery = document.getElementById("gallery");
    if (!galleryOn) {
        galleryOn = true;

        gallery.style.display = "flex";
        gallery.style.justifyContent = "center";

        windowWidth = window.outerWidth;
        var gallerySize = computeWindowSize(windowWidth);
        scaleColumns(gallerySize);
    } else {
        galleryOn = false;
        gallery.style.display = "none";
    }
}

function switchThemeFunction() {
    var body = document.body;
    var menuButtons = document.getElementsByClassName("menuButton");
    var themeButton = document.getElementById("switchThemeButton");

    if (!darkModeOn) {
        darkModeOn = true;

        body.style.color = "white";
        body.style.backgroundColor = darkBackgroundColor;

        themeButton.style.backgroundColor = "white";
        
        for (var i = 0; i < menuButtons.length; i++) { 
            menuButtons[i].style.color = "white";
            menuButtons[i].style.backgroundColor = darkButtonBackgroundColor;
        }
    } else {
        darkModeOn = false;

        body.style.color = "black";
        body.style.backgroundColor = "white";

        themeButton.style.backgroundColor = "black";

        for (var i = 0; i < menuButtons.length; i++) {
            menuButtons[i].style.color = "black";
            menuButtons[i].style.backgroundColor = brightButtonBackgroundColor;
        }
    }
}

window.addEventListener("resize", recomputeWindowWidth);