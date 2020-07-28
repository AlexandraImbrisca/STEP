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

import com.google.appengine.api.users.UserService;
import java.util.Date;

public final class LoginStatus {
  private final boolean loggedIn;
  private final String userEmail;
  private final String loginUrl;
  private final String logoutUrl;

  public LoginStatus(String userEmail, UserService userService) {
    this.userEmail = userEmail;
    if (userEmail == null) {
      this.loggedIn = false;
      this.loginUrl = userService.createLoginURL("/");
      this.logoutUrl = null;
    } else {
      this.loggedIn = true;
      this.loginUrl = null;
      this.logoutUrl = userService.createLogoutURL("/");
    }
  }

  public boolean getLoggedIn() {
    return loggedIn;
  }

  public String getUserEmail() {
    return userEmail;
  }

  public String getLoginUrl() {
    return loginUrl;
  }

  public String getLogoutUrl() {
    return logoutUrl;
  }
}
