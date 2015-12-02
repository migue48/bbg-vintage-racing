'use strict';

(function() {
  var ArticleDeleteCtrl;

  ArticleDeleteCtrl = (function() {
    function ArticleDeleteCtrl($log, $stateParams, $location, ArticleService) {
      this.$log = $log;
      this.ArticleService = ArticleService;
      this.$stateParams = $stateParams;
      this.$location = $location;
      this.deleteArticle();
    }

    ArticleDeleteCtrl.prototype.deleteArticle = function() {
      return this.ArticleService.deleteArticle(this.$stateParams.id).then((function(_this) {
        return function(data) {
          _this.$log.debug("Promise returned " + data.length + " Articles");
          return _this.$location.path("/admin/articles");
        };
      })(this), (function(_this) {
        return function(error) {
          return _this.$log.error("Unable to delete Article: " + error);
        };
      })(this));
    };

    return ArticleDeleteCtrl;

  })();

  controllersModule.controller('ArticleDeleteCtrl', ['$log', '$stateParams', '$location', 'ArticleService', ArticleDeleteCtrl]);

}).call(this);
