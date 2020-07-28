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

import static com.google.sps.data.Constants.ENTITY_NAME;
 
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import java.util.Date;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
 
/** Servlet that adds a new comment to the database. */
@WebServlet("/new-comment")
public class NewCommentServlet extends HttpServlet {
 
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String authorEmail = UserServiceFactory.getUserService().getCurrentUser()
        .getEmail();
    String commentText = request.getParameter("comment-text");
    Date publishTime = new Date();
 

    Entity commentEntity = new Entity(ENTITY_NAME);
    commentEntity.setProperty("author-email", authorEmail);
    commentEntity.setProperty("text", commentText);
    commentEntity.setProperty("publish-time", publishTime);
 
    DatastoreServiceFactory.getDatastoreService().put(commentEntity);
  }
}