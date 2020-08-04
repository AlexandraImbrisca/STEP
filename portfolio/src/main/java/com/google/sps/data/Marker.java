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

package com.google.sps.data;

/** Class used to define the basic characteristics of a marker. */
public final class Marker {
  private final double latitude;
  private final double longitude;
  private final String content;

  /**
   * Creates a new marker with provided values.
   *
   * @param latitude The latitude of the marker's position.
   * @param longitude The longitude of the marker's position.
   * @param content The content of the description provided.
   */
  public Marker(double latitude, double longitude, String content) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.content = content;
  }
}
