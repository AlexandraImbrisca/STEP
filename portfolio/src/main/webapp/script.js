/* eslint-disable no-unused-vars */

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

/** Class used to define the basic characteristics of a theme. */
class Theme {
  /**
   * Create a new theme with the given parameters.
   * @param {string} textColor: The text color of the body.
   * @param {string} backgroundColor: The background color of the body.
   * @param {string} themeButtonColor: The text color of the theme button.
   * @param {string} menuButtonTextColor: The text color of the menu buttons.
   * @param {string} menuButtonBackgroundColor: The background color of the
   * menu buttons.
   * @param {string} menuButtonBorderColor: The border color of the menu
   * buttons.
   */
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

const DARK_THEME = new Theme('white', '#13293d', 'white', 'white', '#2a628f',
    'white');
const BRIGHT_THEME = new Theme('black', 'white', 'black', 'black', '#3e92cc',
    'black');

const GALLERY_SIZE_PERCENT = 75;

/**
 * Apply the given theme to the page.
 * @param {object} theme: The theme that will be applied.
 */
function applyTheme(theme) {
  const MENU_BUTTONS = document.getElementsByClassName('menu-button');
  const THEME_BUTTON = document.getElementById('switch-theme-button');

  document.body.style.color = theme.textColor;
  document.body.style.backgroundColor = theme.backgroundColor;
  THEME_BUTTON.style.backgroundColor = theme.themeButtonColor;

  for (let i = 0; i < MENU_BUTTONS.length; i++) {
    MENU_BUTTONS[i].style.color = theme.menuButtonTextColor;
    MENU_BUTTONS[i].style.backgroundColor = theme.menuButtonBackgroundColor;
    MENU_BUTTONS[i].style.borderColor = theme.menuButtonBorderColor;
  }
}

/**
 * Compute the size of one column based on the size of the entire gallery
 * and the number of columns.
 * @param {array} columns: The columns whose size will be computed.
 * @param {number} gallerySize: The size of the gallery that contains these
 * columns.
 * @return {string}: The size of each column as a percentage.
 */
function computeColumnSize(columns, gallerySize) {
  let columnSize = GALLERY_SIZE_PERCENT / columns.length;
  if (gallerySize < 600) {
    columnSize *= 4;
  } else if (gallerySize < 800) {
    columnSize *= 2;
  }
  return columnSize + '%';
}

/**
 * Display each column of a size computed based on the gallery size and
 * the number of columns.
 */
function displayColumns() {
  const GALLERY_SIZE = document.getElementById('gallery').offsetWidth;
  const COLUMNS = document.getElementsByClassName('gallery-column');
  const COLUMN_SIZE = computeColumnSize(COLUMNS, GALLERY_SIZE);

  for (let i = 0; i < COLUMNS.length; i++) {
    COLUMNS[i].style.flex = COLUMN_SIZE;
    COLUMNS[i].style.maxWidth = COLUMN_SIZE;
  }
}

/**
 * Display the columns of the gallery and then hide the whole content
 * of the hobbies container.
 */
function initAndHideHobbies() {
  displayColumns();
  document.getElementById('hobbies').style.display = 'none';
}

/**
 * Show / hide the content of a container with a given ID.
 * @param {string} containerID: The ID of the container that will be
 * displayed / hidden.
 */
function showContent(containerID) {
  const CONTAINER = document.getElementById(containerID);

  if (CONTAINER.style.display === 'initial') {
    CONTAINER.style.display = 'none';
  } else {
    CONTAINER.style.display = 'initial';
  }
}

/** Switch the theme (bright <-> dark). */
function switchTheme() {
  if (darkModeOn) {
    darkModeOn = false;
    applyTheme(BRIGHT_THEME);
  } else {
    darkModeOn = true;
    applyTheme(DARK_THEME);
  }
}

function getComments() {
  fetch('/comments').then(response => response.text()).then((message) => {
    document.getElementById('comments-section').innerHTML = message;
  });
}

document.addEventListener('DOMContentLoaded', initAndHideHobbies);
window.addEventListener('resize', displayColumns);
