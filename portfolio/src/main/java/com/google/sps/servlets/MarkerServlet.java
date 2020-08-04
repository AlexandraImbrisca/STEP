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

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.gson.Gson;
import com.google.sps.data.Marker;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.BadRequestException;

@WebServlet("/markers")
public class MarkerServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");

    Query query = new Query("Marker");
    PreparedQuery results = DatastoreServiceFactory.getDatastoreService().prepare(query);

    List<Marker> markers = new ArrayList<>();
    results
        .asIterable()
        .forEach(
            entity -> {
              double latitude = (double) entity.getProperty("latitude");
              double longitude = (double) entity.getProperty("longitude");
              String content = (String) entity.getProperty("content");

              Marker marker = new Marker(latitude, longitude, content);
              markers.add(marker);
            });

    Gson gson = new Gson();

    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(markers));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) {
    try {
      double latitude = Double.parseDouble(request.getParameter("latitude"));
      double longitude = Double.parseDouble(request.getParameter("longitude"));
      String content = request.getParameter("content");

      Entity markerEntity = new Entity("Marker");
      markerEntity.setProperty("latitude", latitude);
      markerEntity.setProperty("longitude", longitude);
      markerEntity.setProperty("content", content);

      DatastoreServiceFactory.getDatastoreService().put(markerEntity);
    } catch (Exception e) {
      throw new BadRequestException(e.getMessage());
    }
  }
}
