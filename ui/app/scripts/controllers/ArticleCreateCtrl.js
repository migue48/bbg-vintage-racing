(function() {
  var CreateArticleCtrl;

  CreateArticleCtrl = (function() {
    function CreateArticleCtrl($rootScope, $log, $location, ArticleService) {
      this.$log = $log;
      this.$rootScope = $rootScope;
      this.$location = $location;
      this.ArticleService = ArticleService;
      this.$log.debug("constructing CreateArticleController");
      this.article = {};
    }

    CreateArticleCtrl.prototype.createArticle = function() {
      this.$log.debug("createArticle()");
      this.article.active = true;
      this.article.language = "en";
      this.article.userId = this.$rootScope.user.userID;

      return this.ArticleService.createArticle(this.article).then((function(_this) {
        return function(data) {
          _this.$log.debug("Promise returned " + data + " Article");
          return _this.$location.path('/admin/articles');
        };
      })(this), (function(_this) {
        return function(error) {
          return _this.$log.error("Unable to create Article: " + error);
        };
      })(this));
    };

    return CreateArticleCtrl;

  })();

  controllersModule.controller('CreateArticleCtrl', ['$rootScope', '$log', '$location', 'ArticleService', CreateArticleCtrl]);

}).call(this);
