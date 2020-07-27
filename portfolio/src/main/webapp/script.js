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
  const AUTHOR_ICON_ELEMENT = createElement('i', 'fas fa-star author-icon', '');
  commentElement.appendChild(AUTHOR_ICON_ELEMENT);
}

/** 
 * Adds the details (headline, comment text) to the comment.
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
  let authorName = comment.authorName;
  if (authorName === '') {
    authorName = 'Anonymous user';
  }
  const AUTHOR_NAME_ELEMENT = createElement('p', 'author-name', authorName);
  const PUBLISH_TIME_ELEMENT = createElement('p', 'publish-time',
      comment.publishTime);
  commentHeadlineElement.appendChild(AUTHOR_NAME_ELEMENT);
  commentHeadlineElement.appendChild(PUBLISH_TIME_ELEMENT);
  commentDetailsElement.appendChild(commentHeadlineElement);
}

/** 
 * Adds the options to the comment.
 * @param {Object} comment The original comment.
 * @param {Object} commentElement The element that can be modified based
 * on the options selected (if the user selects delete than this element
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
  const COMMENT_TEXT_ELEMENT = createElement('p', 'comment-text',
      comment.commentText);
  commentDetailsElement.appendChild(COMMENT_TEXT_ELEMENT);
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
  const textareaElement = createElement('textarea', 'update-comment-input', '');
  textareaElement.name = 'update-comment';
  textareaElement.rows = '6';
  textareaElement.innerText = initialText;
  textareaElement.id = 'update-comment';

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
 * Adds a button able to edit the current comment's text.
 * @param {Object} comment The comment to which the button should be
 * attached.
 * @param {Object} commentElement The element that will be deleted if the 
 * button will be selected.
 * @param {Object} commentOptionsElement The element in which the button
 * will be inserted.
 */
function addEditButton(comment, commentElement, commentDetailsElement,
    commentOptionsElement) {
  const editButtonElement = createElement('i',
      'fas fa-edit comment-option-button', '');
  editButtonElement.addEventListener('click', () => {
    commentDetailsElement.innerHTML = '';
    addCommentHeadline(comment, commentDetailsElement);
    const INITIAL_TEXT = comment.commentText;
    addCommentTextarea(comment, commentDetailsElement, INITIAL_TEXT);

    commentOptionsElement.innerHTML = '';
    addSubmitButton(comment, commentElement, commentDetailsElement,
       commentOptionsElement);
    commentDetailsElement.appendChild(commentOptionsElement);
  });
  commentOptionsElement.appendChild(editButtonElement);
}

/** Adds a new comment to the database. */
function addNewComment() {
  const COMMENT_TEXT = document.getElementById('comment-text').value;
  if (COMMENT_TEXT === '') {
    alert('Please fill out the comment field');
    return;
  }

  const AUTHOR_NAME = document.getElementById('author-name').value;
  const params = new URLSearchParams();
  params.append('author-name', AUTHOR_NAME);
  params.append('comment-text', COMMENT_TEXT);
  fetch('/new-comment', {method: 'POST', body: params});
}

/** 
 * Adds a button able to submit the new comment's text.
 * @param {Object} comment The comment to which the button should be
 * attached.
 * @param {Object} commentElement The element that will be deleted if the 
 * button will be selected.
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
  const COMMENTS_CONTAINER = document.getElementById('comments-container');
  const COMMENTS_SECTION = document.getElementById('comments-section');
  const MENU_BUTTONS = document.getElementsByClassName('menu-button');
  const THEME_BUTTON = document.getElementById('switch-theme-button');

  document.body.style.color = theme.textColor;
  document.body.style.backgroundColor = theme.backgroundColor;
  THEME_BUTTON.style.backgroundColor = theme.themeButtonColor;

  COMMENTS_CONTAINER.style.borderTopColor = theme.borderColor;
  COMMENTS_SECTION.style.borderLeftColor = theme.borderColor;

  for (let i = 0; i < MENU_BUTTONS.length; i++) {
    MENU_BUTTONS[i].style.color = theme.menuButtonTextColor;
    MENU_BUTTONS[i].style.backgroundColor = theme.menuButtonBackgroundColor;
    MENU_BUTTONS[i].style.borderColor = theme.menuButtonBorderColor;
  }
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
  const NEW_ELEMENT = document.createElement(elementType);
  NEW_ELEMENT.className = className;
  NEW_ELEMENT.innerText = innerText;

  return NEW_ELEMENT;
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
 * Deletes the comment from the server.
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
  const GALLERY_SIZE = document.getElementById('gallery').offsetWidth;
  const COLUMNS = document.getElementsByClassName('gallery-column');
  const COLUMN_SIZE = computeColumnSize(COLUMNS, GALLERY_SIZE);

  for (let i = 0; i < COLUMNS.length; i++) {
    COLUMNS[i].style.flex = COLUMN_SIZE;
    COLUMNS[i].style.maxWidth = COLUMN_SIZE;
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
        const COMMENTS_LIST = document.getElementById('comments-section');
        comments.forEach((comment) => {
          COMMENTS_LIST.appendChild(createCommentElement(comment));
        });
      });
}


/** Shows the comments region (plus automatic scroll to this area). */
function showComments() {
  const COMMENTS_CONTAINER = document.getElementById('comments-container');
  const SHOW_COMMENTS_BUTTON = document.getElementById('show-comments-button');

  const MARGIN_TOP = SHOW_COMMENTS_BUTTON.offsetHeight + 25;

  COMMENTS_CONTAINER.style.marginTop = MARGIN_TOP + 'px';
  showContent('comments');
  window.scrollTo(0, document.body.scrollHeight);
}

/**
 * Shows / hides the content of a container with a given ID.
 * @param {string} containerID The ID of the container that will be
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

function updateComment(comment) {
  deleteComment(comment);
  const params = new URLSearchParams();
  const AUTHOR_NAME = document.getElementById('author-name').value;
  const COMMENT_TEXT = document.getElementById('update-comment').value;
  comment.commentText = COMMENT_TEXT;
  params.append('author-name', AUTHOR_NAME);
  params.append('comment-text', COMMENT_TEXT);
  fetch('/new-comment', {method: 'POST', body: params});
}

document.addEventListener('DOMContentLoaded', initAndHideHobbies);
window.addEventListener('resize', displayColumns);
