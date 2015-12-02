'use strict';

var articlePreview = angular.module('articlePreview', []);

articlePreview.directive('articlePreview', function() {
  return {
    // The restrict option can be se to:
    //   - 'A' - only matches attribute name
    //   - 'E' - only matches element name
    //   - 'C' - only matches class name
    // These options can be combined e.g. 'AEC'
    restrict: 'A',
    replace: true,
    templateUrl: '/partials/articles/preview.html',
    scope: {
      article: '=data',
      previmg: '@',
    },
    link: function(scope, elem, attr, ctrl, transclude) {
      // populate title, find cover image and calculate text preview.
      scope.title = 'This is the title';
      scope.preview = 'This is the text preview';
    }
  };
});
