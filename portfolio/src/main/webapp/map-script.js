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

import { createElement } from './script.js';

class Position {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
 
class MarkerItem {
  constructor(latitude, longitude, content) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.content = content;
  }
}

function addMarkerTextarea(position, newMarkerElement) {
  const textareaElement = createElement('textarea', '', '');
  textareaElement.name = 'marker-content';
  textareaElement.rows = '3';
  textareaElement.id = 'marker-content' + JSON.stringify(position);
  textareaElement.placeholder = 'Add a short description (optional)';

  newMarkerElement.appendChild(textareaElement);
}

function addNewMarker(newMarker) {
  const params = new URLSearchParams();
  params.append('lat', newMarker.latitude);
  params.append('lng', newMarker.longitude);
  params.append('content', newMarker.content);

  fetch('/markers', {method: 'POST', body: params});
}

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

function createMarkerElement(map, newMarker) {
  const marker = new google.maps.Marker({
    position: {
      lat: newMarker.latitude,
      lng: newMarker.longitude
    },
    map: map
  });

  const infoWindow = new google.maps.InfoWindow({
    content: newMarker.content
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

function createNewMarkerElement(map, markerPosition) {
  const submitMarker = new google.maps.Marker({
    position: {
      lat: markerPosition.latitude,
      lng: markerPosition.longitude
    },
    map: map
  });

  const infoWindow = new google.maps.InfoWindow({
    content: createNewMarkerForm(map, markerPosition, submitMarker)
  });

  google.maps.event.addListener(infoWindow, 'closeclick', () => {
    submitMarker.setMap(null);
  });

  infoWindow.open(map, submitMarker);
}

function createNewMarkerForm(map, markerPosition, submitMarker) {
  const newMarkerElement = createElement('div', '', '');

  addMarkerTextarea(markerPosition, newMarkerElement);
  addSubmitButton(map, markerPosition, newMarkerElement, submitMarker);

  return newMarkerElement;
}

function loadMap(loggedIn) {
  var mapCentre = new google.maps.LatLng(0, 0);
  var mapOptions = {
    zoom: 2,
    center: mapCentre,
    mapTypeId: 'hybrid'
  };
  const map = new google.maps.Map(document.getElementById('map-item'),
      mapOptions);

  if (loggedIn) {
    map.addListener('click', (event) => {
      const markerPosition = new Position(event.latLng.lat(),
          event.latLng.lng());
      createNewMarkerElement(map, markerPosition);
    });
  }

  loadMarkers(map);
}

function loadMarkers(map) {
  fetch('/markers')
      .then(response => response.json())
      .then((markers) => {
        markers.forEach(
          (marker) => {
            const markerItem = new MarkerItem(marker.lat, marker.lng,
                marker.content);
            createMarkerElement(map, markerItem)});
        });
}

export { loadMap };
