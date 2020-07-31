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

import {createElement} from './script.js';

/** Class used to define the coordinates of a position. */
class Position {
  /**
   * Creates a new position with the given coordinates.
   * @param {double} latitude The latitude of the position.
   * @param {double} longitude The longitude of the position.
   */
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

/** Class used to define basic characteristics of a marker. */
class MarkerItem {
  /**
   * Creates a new marker with the given parameters.
   * @param {double} latitude The latitude of the marker's position.
   * @param {double} longitude The longitude of the marker's position.
   * @param {double} content The content of the description provided.
   */
  constructor(latitude, longitude, content) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.content = content;
  }
}

/**
 * Adds a new textarea element to the new marker element.
 * @param {Object} markerPosition The marker's position.
 * @param {Object} newMarkerElement The element in which the textarea
 * will be included.
 */
function addMarkerTextarea(markerPosition, newMarkerElement) {
  const textareaElement = createElement('textarea', '', '');
  textareaElement.name = 'marker-content';
  textareaElement.id = 'marker-content' + JSON.stringify(markerPosition);
  textareaElement.placeholder = 'Add a short description (optional)';
  textareaElement.rows = '3';

  newMarkerElement.appendChild(textareaElement);
}

/**
 * Adds a new marker to the database.
 * @param {Object} newMarker The object associated with the new comment
 * (contains information about latitude, longitude and content).
 */
function addNewMarker(newMarker) {
  const params = new URLSearchParams();
  params.append('latitude', newMarker.latitude);
  params.append('longitude', newMarker.longitude);
  params.append('content', newMarker.content);

  fetch('/markers', {method: 'POST', body: params});
}

/**
 * Adds a button able to submit the description of the new marker.
 * @param {Object} map The map associated with the new marker.
 * @param {Object} markerPosition The position of the new marker.
 * @param {Object} newMarkerElement The element in which the button will be
 * inserted.
 * @param {Object} submitMarker The marker used when adding a new marker.
 */
function addSubmitButton(map, markerPosition, newMarkerElement, submitMarker) {
  const submitButtonElement = createElement('div',
      'submit-button submit-marker-button', 'Submit');

  submitButtonElement.onclick = () => {
    const textareaID = 'marker-content' + JSON.stringify(markerPosition);
    const content = document.getElementById(textareaID).value;
    const marker = new MarkerItem(markerPosition.latitude,
        markerPosition.longitude, content);

    addNewMarker(marker);
    createMarkerElement(map, marker);
    submitMarker.setMap(null);
  };

  newMarkerElement.appendChild(submitButtonElement);
}

/**
 * Creates an introduction message about the map and its functionalities
 * (according to the user's login status)
 * @param {Object} loginStatus An object that determines if the user has
 * the right to add new markers or not.
 */
function createMapIntro(loginStatus) {
  const mapIntroElement = document.getElementById('map-intro');

  if (loginStatus.loggedIn) {
    mapIntroElement.appendChild(createElement('p', '',
        'Get inspired or add your own travel suggestions'));
  } else {
    const loginUrl = createElement('a', 'link', 'Log in');
    loginUrl.href = loginStatus.loginUrl;
    mapIntroElement.appendChild(loginUrl);
    mapIntroElement.appendChild(createElement('p', '',
        'And add your own travel suggestions'));
  }
}

/**
 * Creates the element associated to a given marker.
 * @param {Object} map The map associated with the marker.
 * @param {Object} markerItem The marker's associated data (latitude,
 * longitude, content).
 */
function createMarkerElement(map, markerItem) {
  const marker = new google.maps.Marker({
    position: {
      lat: markerItem.latitude,
      lng: markerItem.longitude},
    map: map});

  const infoWindow = new google.maps.InfoWindow({
    content: markerItem.content});

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

/**
 * Creates the element used to add a new marker.
 * @param {Object} map The map associated with the marker.
 * @param {Object} markerPosition The position where the marker will be
 * inserted.
 */
function createNewMarkerElement(map, markerPosition) {
  const submitMarker = new google.maps.Marker({
    position: {
      lat: markerPosition.latitude,
      lng: markerPosition.longitude},
    map: map});

  const infoWindow = new google.maps.InfoWindow({
    content: createNewMarkerForm(map, markerPosition, submitMarker)});

  google.maps.event.addListener(infoWindow, 'closeclick', () => {
    submitMarker.setMap(null);
  });

  infoWindow.open(map, submitMarker);
}

/**
 * Creates the form used for introducing the content of a new marker.
 * @param {Object} map The map associated with the new marker.
 * @param {Object} markerPosition The position where the marker will be
 * inserted.
 * @param {Object} submitMarker The marker used when adding a new marker.
 * @return {Object} The element created.
 */
function createNewMarkerForm(map, markerPosition, submitMarker) {
  const newMarkerElement = createElement('div', '', '');

  addMarkerTextarea(markerPosition, newMarkerElement);
  addSubmitButton(map, markerPosition, newMarkerElement, submitMarker);

  return newMarkerElement;
}

/**
 * Creates the map and fetches the markers from the database.
 * @param {Object} loginStatus Object that contains data about the current
 * user(it will be used for restricting the feature of adding a new marker).
 */
function loadMap(loginStatus) {
  let mapCentre = new google.maps.LatLng(0, 0);
  let mapOptions = {
    zoom: 2,
    center: mapCentre,
    mapTypeId: 'hybrid'};
  const map = new google.maps.Map(document.getElementById('map-item'),
      mapOptions);

  if (loginStatus.loggedIn) {
    map.addListener('click', (event) => {
      const markerPosition = new Position(event.latLng.lat(),
          event.latLng.lng());
      createNewMarkerElement(map, markerPosition);
    });
  }

  createMapIntro(loginStatus);
  loadMarkers(map);
}
/**
 * Fetches the markers stored in the database.
 * @param {Object} map The map associated with these markers.
 */
function loadMarkers(map) {
  fetch('/markers')
      .then((response) => response.json())
      .then((markers) => {
        markers.forEach((marker) => {
          const markerItem = new MarkerItem(marker.latitude,
              marker.longitude, marker.content);
          createMarkerElement(map, markerItem)
        });
      });
}

export {loadMap};
