(function() {
  var UpdateArticleCtrl;

  UpdateArticleCtrl = (function() {
    function UpdateArticleCtrl($log, $location, $stateParams, ArticleService) {
      this.$log = $log;
      this.$location = $location;
      this.$stateParams = $stateParams;
      this.ArticleService = ArticleService;
      this.$log.debug("constructing UpdateArticleController");
      this.article = {};
      this.findArticle();
    }

    UpdateArticleCtrl.prototype.updateArticle = function() {
      this.$log.debug("updateArticle()");
      this.article.active = true;
      return this.ArticleService.updateArticle(this.$stateParams.id, this.article).then((function(_this) {
        return function(data) {
          _this.$log.debug("Promise returned " + data + " Article");
          return _this.$location.path("/admin/articles");
        };
      })(this), (function(_this) {
        return function(error) {
          return _this.$log.error("Unable to update Article: " + error);
        };
      })(this));
    };

    UpdateArticleCtrl.prototype.findArticle = function() {
      var id;
      id = this.$stateParams.id;
      this.$log.debug("Finding article id: " + id);
      // Update this to use backend find article API
      return this.ArticleService.listArticles().then((function(_this) {
        return function(data) {
          _this.$log.debug("Promise returned " + data.length + " Articles");
          _this.$log.debug(data);
          _this.article = (data.filter(function(article) {
            return article.id === id;
          }))[0];
          return _this.$log.debug(_this.article);
        };
      })(this), (function(_this) {
        return function(error) {
          return _this.$log.error("Unable to get Articles: " + error);
        };
      })(this));
    };

    return UpdateArticleCtrl;

  })();

  controllersModule.controller('UpdateArticleCtrl', ['$log', '$location', '$stateParams', 'ArticleService', UpdateArticleCtrl]);

}).call(this);
