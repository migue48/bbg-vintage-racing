'use strict';

(function() {
  var ArticleCtrl;

  ArticleCtrl = (function() {
    function ArticleCtrl($log, ArticleService) {
      this.$log = $log;
      this.ArticleService = ArticleService;
      this.$log.debug("constructing ArticleController");
      this.articles = [];
      this.getAllArticles();
    }

    ArticleCtrl.prototype.getAllArticles = function() {
      this.$log.debug("getAllArticles()");
      return this.ArticleService.listArticles().then((function(_this) {
        return function(data) {
          _this.$log.debug("Promise returned " + data.length + " Articles");
          return _this.articles = data;
        };
      })(this), (function(_this) {
        return function(error) {
          return _this.$log.error("Unable to get Articles: " + error);
        };
      })(this));
    };

    return ArticleCtrl;

  })();

  controllersModule.controller('ArticleCtrl', ['$log', 'ArticleService', ArticleCtrl]);

}).call(this);
