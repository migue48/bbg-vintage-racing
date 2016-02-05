'use strict';


var UpdateArticleCtrl = (function() {
  function UpdateArticleCtrl($log, $location, $stateParams, ArticleService) {
    this.$log = $log;
    this.$location = $location;
    this.$stateParams = $stateParams;
    this.ArticleService = ArticleService;
    this.article = {};
    this.findArticle();
  }

  UpdateArticleCtrl.prototype.updateArticle = function() {
    return this.ArticleService.update(this.$stateParams.id, this.article).then((function(_this) {
      return function(data) {
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
    // Update this to use backend find article API
    return this.ArticleService.list().then((function(_this) {
      return function(data) {
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


var ArticleShowCtrl = (function() {
  function ArticleShowCtrl($log, $stateParams, ArticleService) {
    this.$log = $log;
    this.$stateParams = $stateParams;
    this.ArticleService = ArticleService;
    this.article = {};
    this.getArticle(this.$stateParams.id);
  }

  ArticleShowCtrl.prototype.getArticle = function(id) {
    return this.ArticleService.show(id).then((function(_this) {
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



var ArticleDeleteCtrl = (function() {
  function ArticleDeleteCtrl($log, $stateParams, $location, ArticleService) {
    this.$log = $log;
    this.ArticleService = ArticleService;
    this.$stateParams = $stateParams;
    this.$location = $location;
    this.deleteArticle();
  }

  ArticleDeleteCtrl.prototype.deleteArticle = function() {
    return this.ArticleService.destroy(this.$stateParams.id).then((function(_this) {
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




var CreateArticleCtrl = (function() {
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

    return this.ArticleService.create(this.article).then((function(_this) {
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



var ArticleCtrl =  (function() {
  function ArticleCtrl($log, ArticleService) {
    this.$log = $log;
    this.ArticleService = ArticleService;
    this.$log.debug("constructing ArticleController");
    this.articles = [];
    this.getAllArticles();
  }

  ArticleCtrl.prototype.getAllArticles = function() {
    this.$log.debug("getAllArticles()");
    return this.ArticleService.list().then((function(_this) {
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

