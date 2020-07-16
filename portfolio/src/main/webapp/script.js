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

class Theme {
  constructor(
      textColor, 
      backgroundColor,
      themeButtonColor,
      menuButtonTextColor,
      menuButtonBackgroundColor,
      menuButtonBorderColor) {
        this.textColor = textColor; 
        this.backgroundColor = backgroundColor;
        this.themeButtonColor = themeButtonColor;
        this.menuButtonTextColor = menuButtonTextColor;
        this.menuButtonBackgroundColor = menuButtonBackgroundColor;
        this.menuButtonBorderColor = menuButtonBorderColor;
    }
}

const DARK_THEME = new Theme('white', '#13293d', 'white', 'white', '#2a628f', 'white');
const BRIGHT_THEME = new Theme('black', 'white', 'black', 'black', '#3e92cc', 'black');

const GALLERY_SIZE_PERCENT = 75;

function applyTheme(theme) {
  let menuButtons = document.getElementsByClassName('menu-button');
  let themeButton = document.getElementById('switch-theme-button');

  document.body.style.color = theme.textColor;
  document.body.style.backgroundColor = theme.backgroundColor;
  themeButton.style.backgroundColor = theme.themeButtonColor;

  for (let i = 0; i < menuButtons.length; i++) { 
    menuButtons[i].style.color = theme.menuButtonTextColor;
    menuButtons[i].style.backgroundColor = theme.menuButtonBackgroundColor;
    menuButtons[i].style.borderColor = theme.menuButtonBorderColor;
  }
}

function computeColumnSize(columns, gallerySize) {
  let columnSize = GALLERY_SIZE_PERCENT / columns.length;
  if (gallerySize < 600) {
    columnSize *= 4;
  } else if (gallerySize < 800) {
    columnSize *= 2;
  }
  return columnSize + '%';
}

function displayColumns() {
  let gallerySize = document.getElementById('gallery').offsetWidth;
  let columns = document.getElementsByClassName('column');
  let columnSize = computeColumnSize(columns, gallerySize);
  
  for (let i = 0; i < columns.length; i++) {
    columns[i].style.flex = columnSize;
    columns[i].style.maxWidth = columnSize;
  }
}

function showGallery() {
  let gallery = document.getElementById('gallery');
  let galleryDisplay = gallery.style.display;
  let galleryShown = (galleryDisplay.localeCompare("flex") === 0);

  if (galleryShown) {
    gallery.style.display = 'none';
  } else {
    gallery.style.display = 'flex';
    gallery.style.justifyContent = 'center';

    displayColumns();
  }
}
function showProjects() {
  let projectsContainer = document.getElementById('projects');
  let projectsDisplay = projectsContainer.style.display;
  let projectsShown = (projectsDisplay === 'initial');
  if (projectsShown) {
    projectsContainer.style.display = 'none';
  } else {
    projectsContainer.style.display = 'initial';
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