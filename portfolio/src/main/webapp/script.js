// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let darkModeOn = false;
let galleryShown = false;

class Theme {
  constructor(
      textColor, 
      backgroundColor,
      themeButtonColor,
      menuButtonTextColor,
      menuButtonBackgroundColor) {
        this.textColor = textColor; 
        this.backgroundColor = backgroundColor;
        this.themeButtonColor = themeButtonColor;
        this.menuButtonTextColor = menuButtonTextColor;
        this.menuButtonBackgroundColor = menuButtonBackgroundColor;
    }
}

const DARK_THEME = new Theme('white', '#13293d', 'white', 'white', '#2a628f');
const BRIGHT_THEME = new Theme('black', 'white', 'black', 'black', '#3e92cc');

const GALLERY_SIZE_PERCENT = 75;

function applyTheme(theme) {
  var body = document.body;
  var menuButtons = document.getElementsByClassName('menu-button');
  var themeButton = document.getElementById('switch-theme-button');

  body.style.color = theme.textColor;
  body.style.backgroundColor = theme.backgroundColor;
  themeButton.style.backgroundColor = theme.themeButtonColor;

  for (var i = 0; i < menuButtons.length; i++) { 
    menuButtons[i].style.color = theme.menuButtonTextColor;
    menuButtons[i].style.backgroundColor = theme.menuButtonBackgroundColor;
  }
}

function computeColumnSize(columns, gallerySize) {
  var columnSize = GALLERY_SIZE_PERCENT / columns.length;
  if (gallerySize < 600) {
    columnSize *= 4;
  } else if (gallerySize < 800) {
    columnSize *= 2;
  }
  return columnSize + '%';
}

function displayColumns() {
  var gallerySize = document.getElementById('gallery').offsetWidth;
  var columns = document.getElementsByClassName('column');
  var columnSize = computeColumnSize(columns, gallerySize);
  
  scaleColumns(columns, columnSize);
}

function scaleColumns(columns, columnSize) {
  for (var i = 0; i < columns.length; i++) {
    columns[i].style.flex = columnSize;
    columns[i].style.maxWidth = columnSize;
  }
}

function showGallery() {
  var gallery = document.getElementById('gallery');
  if (galleryShown) {
    galleryShown = false;
    gallery.style.display = 'none';
  } else {
    galleryShown = true;
    gallery.style.display = 'flex';
    gallery.style.justifyContent = 'center';

    displayColumns();
  }
}

function switchTheme() {
  if (darkModeOn) {
    darkModeOn = false;
    applyTheme(BRIGHT_THEME);
  } else {
    darkModeOn = true;
    applyTheme(DARK_THEME);
  }
}

window.addEventListener('resize', displayColumns);