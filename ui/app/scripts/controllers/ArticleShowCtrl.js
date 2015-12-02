'use strict';

(function() {
  var ArticleShowCtrl = (function() {
    function ArticleShowCtrl($log, $stateParams, ArticleService) {
      this.$log = $log;
      this.$stateParams = $stateParams;
      this.ArticleService = ArticleService;
      this.article = {};
      this.getArticle(this.$stateParams.id);
    }

    ArticleShowCtrl.prototype.getArticle = function(id) {
      return this.ArticleService.showArticle(id).then((function(_this) {
        return function(data) {
          return _this.article = data.article;
        };
      })(this), (function(_this) {
        return function(error) {
          return _this.$log.error("Unable to get article: " + error);
        };
      })(this));
    };
    return ArticleShowCtrl;
  })();

  controllersModule.controller('ArticleShowCtrl', ['$log', '$stateParams', 'ArticleService', ArticleShowCtrl]);

}).call(this);
