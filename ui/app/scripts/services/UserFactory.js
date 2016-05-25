/**
  * Copyright (C) 2015-2016 Miguel Osorio. All rights reserved.
  */
'use strict';

/**
 * The user factory.
 */
app.factory('UserFactory', function($http) {
  return {
    get: function() {
      return $http.get('/user');
    }
  };
});
