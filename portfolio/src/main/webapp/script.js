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

import { loadComments } from './comments-script.js';
import { loadMap } from './map-script.js';

let darkModeOn = false;

/** Class used to define the basic characteristics of a theme. */
class Theme {
  /**
   * Creates a new theme with the given parameters.
   * @param {string} textColor The text color of the body.
   * @param {string} backgroundColor The background color of the body.
   * @param {string} themeButtonColor The text color of the theme button.
   * @param {string} borderColor The color of the main borders in the page.
   * @param {string} menuButtonTextColor The text color of the menu buttons.
   * @param {string} menuButtonBackgroundColor The background color of the
   * menu buttons.
   * @param {string} menuButtonBorderColor The border color of the menu
   * buttons.
   */
  constructor(
      textColor,
      backgroundColor,
      themeButtonColor,
      borderColor,
      menuButtonTextColor,
      menuButtonBackgroundColor,
      menuButtonBorderColor) {
    this.textColor = textColor;
    this.backgroundColor = backgroundColor;
    this.themeButtonColor = themeButtonColor;
    this.borderColor = borderColor;
    this.menuButtonTextColor = menuButtonTextColor;
    this.menuButtonBackgroundColor = menuButtonBackgroundColor;
    this.menuButtonBorderColor = menuButtonBorderColor;
  }
}

const DARK_THEME = new Theme('white', '#13293d', 'white', 'white', 'white',
    '#2a628f', 'white');
const BRIGHT_THEME = new Theme('black', 'white', 'black', 'black', 'black',
    '#3e92cc', 'black');
const OPTIONS_LIST = ['comments', 'map'];

const GALLERY_SIZE_PERCENT = 75;

/**
 * Applies the given theme to the page.
 * @param {object} theme The theme that will be applied.
 */
function applyTheme(theme) {
  const commentsContainer = document.getElementById('comments-container');
  const commentsSection = document.getElementById('comments-section');
  const menuButtons = document.getElementsByClassName('menu-button');
  const themeButton = document.getElementById('switch-theme-button');

  document.body.style.color = theme.textColor;
  document.body.style.backgroundColor = theme.backgroundColor;
  themeButton.style.backgroundColor = theme.themeButtonColor;

  commentsContainer.style.borderTopColor = theme.borderColor;
  commentsSection.style.borderLeftColor = theme.borderColor;

  for (let i = 0; i < menuButtons.length; i++) {
    menuButtons[i].style.color = theme.menuButtonTextColor;
    menuButtons[i].style.backgroundColor = theme.menuButtonBackgroundColor;
    menuButtons[i].style.borderColor = theme.menuButtonBorderColor;
  }
}

/**
 * Changes the display property of the container with the one received.
 * @param {String} containerID The ID of the container.
 * @param {String} displayType The new display value.
 */
function changeContainerDisplay(containerID, displayType) {
  const container = document.getElementById(containerID);
  container.style.display = displayType;
}

/**
 * Computes the size of one column based on the size of the entire gallery
 * and the number of columns.
 * @param {array} columns The columns whose size will be computed.
 * @param {number} gallerySize The size of the gallery that contains these
 * columns.
 * @return {string} The size of each column as a percentage.
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
 * Creates a new element with a specified type, class and innerText.
 * @param {string} elementType The type of the element that will be created.
 * @param {string} className The class of the element that will be created.
 * @param {string} innerText The innerText of the element that will be
 * created.
 * @return {element} The element created.
 */
function createElement(elementType, className, innerText) {
  const newElement = document.createElement(elementType);
  newElement.className = className;
  newElement.innerText = innerText;

  return newElement;
}

/**
 * Displays each column of a size computed based on the gallery size and
 * the number of columns.
 */
function displayColumns() {
  const gallerySize = document.getElementById('gallery').offsetWidth;
  const columns = document.getElementsByClassName('gallery-column');
  const columnSize = computeColumnSize(columns, gallerySize);

  for (let i = 0; i < columns.length; i++) {
    columns[i].style.flex = columnSize;
    columns[i].style.maxWidth = columnSize;
  }
}

/**
 * Closes all the other options currently opened (without affecting the state
 * of the option received).
 * @param {String} newOption The option whose state shouldn't be changed.
 */
function hideCurrentlyOpenOptions(newOption) {
  for (let i = 0; i < OPTIONS_LIST.length; i++) {
    if (OPTIONS_LIST[i] !== newOption) {
      changeContainerDisplay(OPTIONS_LIST[i], 'none');
    }
  }
}

/**
 * Displays the columns of the gallery and then hide the whole content
 * of the hobbies container.
 */
function initAndHideHobbies() {
  displayColumns();
  document.getElementById('hobbies').style.display = 'none';
}

/**
 * Gets the login status of the user.
 * @return {Object} An object that contains all the login data, such as
 * user's email address.
 */
async function loadLoginStatus() {
  const loginStatusData = await fetch('login-status');
  const loginStatus = await loginStatusData.json();

  return loginStatus;
}

/**
 * Loads the content stored in the database.
 */
async function loadPage() {
  const loginStatus = await loadLoginStatus();
  const userEmail = await loginStatus.userEmail;

  loadMap(loginStatus);
  loadComments(userEmail);
}

/**
 * Shows / hides the content of a container with a given ID.
 * @param {string} containerID The ID of the container that will be
 * displayed / hidden.
 */
function showHideContent(containerID) {
  if (document.getElementById(containerID).style.display === 'initial') {
    changeContainerDisplay(containerID, 'none');
  } else {
    changeContainerDisplay(containerID, 'initial');
  }
}

/**
 * Shows / hides one of the footer contents (plus automatic scroll to this
 * area).
 * @param {String} contentType The contentType of the container that will be
 * displayed / hidden.
 */
function showHideFooterContent(contentType) {
  hideCurrentlyOpenOptions(contentType);
 
  const commentsContainer = document.getElementById(contentType + '-container');
  const optionsMenu = document.getElementById('options-menu');
  const marginTop = optionsMenu.offsetHeight + 30;
 
  commentsContainer.style.marginTop = marginTop + 'px';
  showHideContent(contentType);
  window.scrollTo(0, document.body.scrollHeight);
}

/** Switches the theme (bright <-> dark). */
function switchTheme() {
  if (darkModeOn) {
    darkModeOn = false;
    applyTheme(BRIGHT_THEME);
  } else {
    darkModeOn = true;
    applyTheme(DARK_THEME);
  }
}

document.addEventListener('DOMContentLoaded', initAndHideHobbies);
window.addEventListener('resize', displayColumns);

window.loadPage = loadPage;
window.showHideContent = showHideContent;
window.showHideFooterContent = showHideFooterContent;
window.switchTheme = switchTheme;

export { changeContainerDisplay, createElement, loadLoginStatus,
    showHideContent, showHideFooterContent };