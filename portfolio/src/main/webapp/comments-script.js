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

import { changeContainerDisplay, createElement, showHideContent, showFooterContent } from './script.js';

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
 * @param {String} userEmail The email address of the current user.
 */
function addCommentDetails(comment, commentElement, userEmail) {
  const commentDetailsElement = createElement('div', 'comment-details', '');

  addCommentHeadline(comment, commentDetailsElement);
  addCommentText(comment, commentDetailsElement);

  if (comment.authorEmail === userEmail) {
    addCommentOptions(comment, commentElement, commentDetailsElement,
        userEmail);
  }

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
 * @param {String} userEmail The email address of the current user.
 */
function addCommentOptions(comment, commentElement, commentDetailsElement,
    userEmail) {
  const commentOptionsElement = createElement('div', 'comment-options', '');

  addEditButton(comment, commentElement, commentDetailsElement,
      commentOptionsElement, userEmail);
  addDeleteButton(comment, commentElement, commentOptionsElement);

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
 * @param {String} userEmail The email address of the current user.
 */
function addEditButton(comment, commentElement, commentDetailsElement,
    commentOptionsElement, userEmail) {
  const editButtonElement = createElement('i',
      'fas fa-edit comment-option-button', '');

  editButtonElement.addEventListener('click', () => {
    const initialText = comment.commentText;
    commentDetailsElement.innerHTML = '';
    commentOptionsElement.innerHTML = '';
    addCommentHeadline(comment, commentDetailsElement);
    addCommentTextarea(comment, commentDetailsElement, initialText);
    addSubmitButton(comment, commentElement, commentDetailsElement,
        commentOptionsElement, userEmail);
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
 * @param {String} userEmail The email address of the current user.
 */
function addSubmitButton(comment, commentElement, commentDetailsElement,
    commentOptionsElement, userEmail) {
  const submitButtonElement = createElement('i',
      'fas fa-paper-plane comment-option-button', '');

  submitButtonElement.addEventListener('click', () => {
    updateComment(comment);
    commentDetailsElement.remove();
    addCommentDetails(comment, commentElement, userEmail);
  });

  commentOptionsElement.appendChild(submitButtonElement);
}

/**
 * Creates the element associated to a given comment.
 * @param {object} comment The comment for which we will create a new element.
 * @param {String} userEmail The email address of the current user.
 * @return {element} The element created.
 */
function createCommentElement(comment, userEmail) {
  const commentElement = createElement('div', 'comment', '');
  addAuthorIcon(commentElement);
  addCommentDetails(comment, commentElement, userEmail);

  return commentElement;
}

/**
 * Creates the header associated with the logged in user.
 * @param {Object} loginStatus This object includes information such as
 * user email and logout link.
 * @param {Object} loginStatusContainer The container that will include
 * this header.
 */
function createLoggedInHeader(loginStatus, loginStatusContainer) {
  loginStatusContainer.appendChild(createElement('p', '',
      'Logged in as ' + loginStatus.userEmail));
  const logoutUrlContainer = createElement('div', '', 'Not you? Logout ');
  const logoutUrl = createElement('a', 'link', 'here');
  logoutUrl.href = loginStatus.logoutUrl;
  logoutUrlContainer.appendChild(logoutUrl);
  loginStatusContainer.appendChild(logoutUrlContainer);
}

/**
 * Creates the header associated with the anonymous user.
 * @param {Object} loginStatus This object includes information such as
 * login link.
 * @param {Object} loginStatusContainer The container that will include
 * this header.
 */
function createLoggedOutHeader(loginStatus, loginStatusContainer) {
  loginStatusContainer.appendChild(createElement('p', '',
      'Only logged in users can add comments'));
  const loginUrlContainer = createElement('div', '', 'Login ');
  const loginUrl = createElement('a', 'link', 'here');
  loginUrl.href = loginStatus.loginUrl;
  loginUrlContainer.appendChild(loginUrl);
  loginStatusContainer.appendChild(loginUrlContainer);
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

/** Fetches comments from the server and adds them to the DOM. */
async function loadComments() {
  const commentsData = await fetch('/list-comments');
  const comments = await commentsData.json();
  const commentsList = document.getElementById('comments-section');

  const loginStatus = await loadLoginStatus();
  const userEmail = await loginStatus.userEmail;

  comments.forEach((comment) => {
    commentsList.appendChild(createCommentElement(comment, userEmail));
  });
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
  showFooterContent('comments');
 
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

window.addNewComment = addNewComment;
window.showComments = showComments;

export { loadComments };