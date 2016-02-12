'use strict';


var UpdateArticleCtrl = (function() {
  function UpdateArticleCtrl($log, $location, $stateParams, $alert, ArticleService) {
    this.$log = $log;
    this.$location = $location;
    this.$stateParams = $stateParams;
    this.ArticleService = ArticleService;
    this.article = {};
    this.getArticle(this.$stateParams.id);
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

  UpdateArticleCtrl.prototype.getArticle = function(id) {
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
  return UpdateArticleCtrl;
})();

controllersModule.controller('UpdateArticleCtrl', ['$log', '$location', '$stateParams', '$alert', 'ArticleService', UpdateArticleCtrl]);


var ArticleShowCtrl = (function() {
  function ArticleShowCtrl($log, $stateParams, $alert, ArticleService) {
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

controllersModule.controller('ArticleShowCtrl', ['$log', '$stateParams', '$alert', 'ArticleService', ArticleShowCtrl]);



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
  function ArticleCtrl($log, $alert, ArticleService) {
    this.$log = $log;
    this.$alert = $alert;
    this.ArticleService = ArticleService;
    this.articles = [];
    this.languages = [{'label':'English','code':'en'},{'label':'Italiano','code':'it'}];
    this.active = ['Active', 'Inactive'];
    this.selLang = 0;
    this.selActive = 0;
    this.getAllArticles();
  }

  ArticleCtrl.prototype.selectLanguage = function(index) {
    this.selLang = index;
    this.getAllArticles();
  };

  ArticleCtrl.prototype.selectActive = function(index) {
    this.selActive = index;
    this.getAllArticles();
  };

  ArticleCtrl.prototype.getAllArticles = function() {
    this.articles.length = 0;
    return this.ArticleService.list({
        'active': (this.active[this.selActive] == 'Active')? true:false,
        'language': this.languages[this.selLang].code
      }).then((function(_this) {
        return function(data) {
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

controllersModule.controller('ArticleCtrl', ['$log', '$alert', 'ArticleService', ArticleCtrl]);

