/**
  * Copyright (C) 2015-2016 Miguel Osorio. All rights reserved.
  */
'use strict';

/*global app: false */

/**
 * The navigation controller.
 */
app.controller('NavigationCtrl', ['$scope', '$auth', '$translate', function($scope, $auth, $translate) {

  /**
   * Indicates if the user is authenticated or not.
   *
   * @returns {boolean} True if the user is authenticated, false otherwise.
   */
  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };
}]);
