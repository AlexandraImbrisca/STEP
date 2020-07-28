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

const GALLERY_SIZE_PERCENT = 75;

/**
 * Adds the author icon to the comment.
 * @param {Object} commentElement The comment element in which the author
 * icon will be included.
 */
function addAuthorIcon(commentElement) {
  const authorIconElement = createElement('i', 'fas fa-star author-icon', '');
  commentElement.appendChild(authorIconElement);
}

/**
 * Adds the details (headline, text, options) to the comment.
 * @param {Object} comment The original comment.
 * @param {Object} commentElement The comment element in which the comment
 * details will be included.
 */
function addCommentDetails(comment, commentElement) {
  const commentDetailsElement = createElement('div', 'comment-details', '');

  addCommentHeadline(comment, commentDetailsElement);
  addCommentText(comment, commentDetailsElement);
  addCommentOptions(comment, commentElement, commentDetailsElement);

  commentElement.appendChild(commentDetailsElement);
}

/**
 * Adds the headline (author name, publish time) to the comment.
 * @param {Object} comment The original comment.
 * @param {Object} commentDetailsElement The comment details element
 * in which the headline will be included.
 */
function addCommentHeadline(comment, commentDetailsElement) {
  const commentHeadlineElement = createElement('div', 'comment-headline', '');
  const authorEmailElement = createElement('p', 'author-email',
      comment.authorEmail);
  const publishTimeElement = createElement('p', 'publish-time',
      comment.publishTime);
  commentHeadlineElement.appendChild(authorEmailElement);
  commentHeadlineElement.appendChild(publishTimeElement);
  commentDetailsElement.appendChild(commentHeadlineElement);
}

/**
 * Adds the options to the comment.
 * @param {Object} comment The original comment.
 * @param {Object} commentElement The element that can be modified based
 * on the options selected (e.g. if the user selects delete then this element
 * will be removed from the comments section).
 * @param {Object} commentDetailsElement The comment details element
 * in which the options will be included.
 */
function addCommentOptions(comment, commentElement, commentDetailsElement) {
  const commentOptionsElement = createElement('div', 'comment-options', '');

  addDeleteButton(comment, commentElement, commentOptionsElement);
  addEditButton(comment, commentElement, commentDetailsElement,
      commentOptionsElement);

  commentDetailsElement.appendChild(commentOptionsElement);
}

/**
 * Adds the comment text to the comment.
 * @param {Object} comment The original comment.
 * @param {Object} commentDetailsElement The comment details element
 * in which the text will be included.
 */
function addCommentText(comment, commentDetailsElement) {
  const commentTextElement = createElement('p', 'comment-text',
      comment.commentText);
  commentDetailsElement.appendChild(commentTextElement);
}

/**
 * Adds a new textarea element to the comment details element.
 * @param {Object} comment The original comment.
 * @param {Object} commentDetailsElement The comment details element
 * in which the textarea will be included.
 * @param {Object} initialText The text that will be initially included
 * in the textarea element.
 */
function addCommentTextarea(comment, commentDetailsElement, initialText) {
  const textareaElement = createElement('textarea', '', '');
  textareaElement.name = 'update-comment';
  textareaElement.rows = '6';
  textareaElement.innerText = initialText;
  textareaElement.id = 'update-comment' + comment.id;

  commentDetailsElement.appendChild(textareaElement);
}

/**
 * Adds a button able to delete the comment.
 * @param {Object} comment The comment to which the button should be
 * attached.
 * @param {Object} commentElement The element that will be deleted if the
 * button will be selected.
 * @param {Object} commentOptionsElement The element in which the button
 * will be inserted.
 */
function addDeleteButton(comment, commentElement, commentOptionsElement) {
  const deleteButtonElement = createElement('i',
      'fas fa-trash-alt comment-option-button', '');

  deleteButtonElement.addEventListener('click', () => {
    deleteComment(comment);
    commentElement.remove();
  });

  commentOptionsElement.appendChild(deleteButtonElement);
}

/**
 * Adds a button able to edit the comment text.
 * @param {Object} comment The comment to which the button should be
 * attached.
 * @param {Object} commentElement The element that will incorporate the new
 * details of the comment after submission.
 * @param {Object} commentDetailsElement The comment details element will be
 * modified if the button is clicked (e.g. include the textarea used to
 * update the comment).
 * @param {Object} commentOptionsElement The element in which the button
 * will be inserted.
 */
function addEditButton(comment, commentElement, commentDetailsElement,
    commentOptionsElement) {
  const editButtonElement = createElement('i',
      'fas fa-edit comment-option-button', '');

  editButtonElement.addEventListener('click', () => {
    const initialText = comment.commentText;
    commentDetailsElement.innerHTML = '';
    commentOptionsElement.innerHTML = '';
    addCommentHeadline(comment, commentDetailsElement);
    addCommentTextarea(comment, commentDetailsElement, initialText);
    addSubmitButton(comment, commentElement, commentDetailsElement,
        commentOptionsElement);
    commentDetailsElement.appendChild(commentOptionsElement);
  });

  commentOptionsElement.appendChild(editButtonElement);
}

/** Adds a new comment to the database. */
function addNewComment() {
  const commentText = document.getElementById('comment-text').value;
  sendComment(commentText);
}

/**
 * Adds a button able to submit the new comment text.
 * @param {Object} comment The comment to which the button should be
 * attached.
 * @param {Object} commentElement The element that will incorporate the new
 * details of the comment after submission.
 * @param {Object} commentDetailsElement The comment details element that
 * will be removed if the button is clicked.
 * @param {Object} commentOptionsElement The element in which the button
 * will be inserted.
 */
function addSubmitButton(comment, commentElement, commentDetailsElement,
    commentOptionsElement) {
  const submitButtonElement = createElement('i',
      'fas fa-paper-plane comment-option-button', '');

  submitButtonElement.addEventListener('click', () => {
    updateComment(comment);
    commentDetailsElement.remove();
    addCommentDetails(comment, commentElement);
  });

  commentOptionsElement.appendChild(submitButtonElement);
}

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

  for (let i = 0; i < MENU_BUTTONS.length; i++) {
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
 * Creates the element associated to a given comment.
 * @param {object} comment The comment for which we will create a new element.
 * @return {element} The element created.
 */
function createCommentElement(comment) {
  const commentElement = createElement('div', 'comment', '');
  addAuthorIcon(commentElement);
  addCommentDetails(comment, commentElement);

  return commentElement;
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
 * Creates the header associated with the logged in user.
 * @param {Object} loginStatus This object includes information such as
 * user email and logout link
 * @param {Object} loginStatusContainer The container that will include
 * this header.
 */
function createLoggedInHeader(loginStatus, loginStatusContainer) {
  loginStatusContainer.appendChild(createElement('p', '',
      'Currently logged in using the following email address: '
      + loginStatus.userEmail));
  const logoutUrlContainer = createElement('div', '', 'Not you? Logout ');
  const logoutUrl = createElement('a', '', 'here');
  logoutUrl.href = loginStatus.logoutUrl;
  logoutUrlContainer.appendChild(logoutUrl);
  loginStatusContainer.appendChild(logoutUrlContainer);
}

/**
 * Creates the header associated with the anonymous user.
 * @param {Object} loginStatus This object includes information such as
 * login link
 * @param {Object} loginStatusContainer The container that will include
 * this header.
 */
function createLoggedOutHeader(loginStatus, loginStatusContainer) {
  loginStatusContainer.appendChild(createElement('p', '',
      'You have to be logged in order to add comments'));
  const loginUrlContainer = createElement('div', '', 'Login ');
  const loginUrl = createElement('a', '', 'here');
  loginUrl.href = loginStatus.loginUrl;
  loginUrlContainer.appendChild(loginUrl);
  loginStatusContainer.appendChild(loginUrlContainer);
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
 * Deletes the comment from the database.
 * @param {Object} comment The comment that will be deleted.
 */
function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append('id', comment.id);
  fetch('/delete-comment', {method: 'POST', body: params});
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
 * Displays the columns of the gallery and then hide the whole content
 * of the hobbies container.
 */
function initAndHideHobbies() {
  displayColumns();
  document.getElementById('hobbies').style.display = 'none';
}

/** Fetches comments from the server and adds them to the DOM. */
function loadComments() {
  fetch('/list-comments')
      .then((response) => response.json())
      .then((comments) => {
        const commentsList = document.getElementById('comments-section');
        comments.forEach((comment) => {
          commentsList.appendChild(createCommentElement(comment));
        });
      });
}

/**
 * Gets the login status of the user.
 * @return {String} The user's email address or null if the user is not
 * logged in.
 */
async function loadLoginStatus() {
  const loginStatusData = await fetch('login-status');
  const loginStatus = await loginStatusData.json();

  return loginStatus;
}

/**
 * Creates and uses a new URLSearchParams() object to add a new comment
 * in the database.
 * @param {String} commentText The text of the new comment.
 */
function sendComment(commentText) {
  const params = new URLSearchParams();
  params.append('comment-text', commentText);
  fetch('/new-comment', {method: 'POST', body: params});
}

/** Shows the comments region (plus automatic scroll to this area). */
async function showComments() {
  const commentsContainer = document.getElementById('comments-container');
  const showCommentsButton = document.getElementById('show-comments-button');
  const marginTop = showCommentsButton.offsetHeight + 25;

  commentsContainer.style.marginTop = marginTop + 'px';
  showHideContent('comments');
  window.scrollTo(0, document.body.scrollHeight);

  const loginStatusContainer = document.getElementById('login-status');
  loginStatusContainer.innerHTML = '';

  const loginStatus = await loadLoginStatus();
  const loggedIn = await loginStatus.loggedIn;
  if (loggedIn) {
    changeContainerDisplay('new-comment-form', 'initial');
    createLoggedInHeader(loginStatus, loginStatusContainer);
  } else {
    changeContainerDisplay('new-comment-form', 'none');
    createLoggedOutHeader(loginStatus, loginStatusContainer);
  }
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

/**
 * Updates the comment in the database.
 * @param {Object} comment The comment that will be updated.
 */
function updateComment(comment) {
  const commentText = document.getElementById('update-comment' + comment.id)
      .value;

  deleteComment(comment);
  comment.commentText = commentText;
  sendComment(commentText);
}

document.addEventListener('DOMContentLoaded', initAndHideHobbies);
window.addEventListener('resize', displayColumns);
