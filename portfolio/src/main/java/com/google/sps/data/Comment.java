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

import java.util.Date;

public final class Comment {
  private final String authorName;
  private final String commentText;
  private final Date publishTime;

  public Comment(String authorName, String commentText, Date publishTime) {
    this.authorName = authorName;
    this.commentText = commentText;
    this.publishTime = publishTime;
  }

  public String getAuthorName() {
    return authorName;
  }

  public String getCommentText() {
    return commentText;
  }

  public Date getPublishTime() {
    return publishTime;
  }
}
