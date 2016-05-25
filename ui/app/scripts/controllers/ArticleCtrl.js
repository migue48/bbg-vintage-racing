/**
  * Copyright (C) 2015-2016 Miguel Osorio. All rights reserved.
  */
'use strict';

controllersModule.controller('UpdateArticleCtrl', ['$log', '$location', '$stateParams', '$alert', 'ArticleService', 'TranslationService', function() {
  function UpdateArticleCtrl($log, $location, $stateParams, $alert, ArticleService, TranslationService) {
    this.$log = $log;
    this.$location = $location;
    this.$stateParams = $stateParams;
    this.ArticleService = ArticleService;
    this.TranslationService = TranslationService;
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
}()]);

controllersModule.controller('ArticleShowCtrl', ['$log', '$stateParams', '$alert', 'ArticleService', function() {
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
}()]);

controllersModule.controller('ArticleDeleteCtrl', ['$log', '$stateParams', '$location', 'ArticleService', function() {
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
}()]);

controllersModule.controller('CreateArticleCtrl', ['$rootScope', '$log', '$location', '$stateParams', 'ArticleService', 'TranslationService', function() {
  function CreateArticleCtrl($rootScope, $log, $location, $stateParams, ArticleService, TranslationService) {
    this.$log = $log;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.ArticleService = ArticleService;
    this.TranslationService = TranslationService;
    this.languages = this.TranslationService.supportedLanguages();
    this.article = {};
    this.refId = $stateParams.id;
    if (this.refId === undefined || this.refId === null) {
      this.article.language = 'en';
      this.article.active = true;
      return;
    }
    this.getArticle($stateParams.id);
  }

  CreateArticleCtrl.prototype.createArticle = function() {
    this.article.userId = this.$rootScope.user.userID;
    return this.ArticleService.create(this.article).then((function(_this) {
      return function(data) {
        return _this.$location.path('/admin/articles');
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to create Article: " + error);
      };
    })(this));
  };

  CreateArticleCtrl.prototype.getArticle = function(id) {
    return this.ArticleService.show(id).then((function(_this) {
      return function(data) {
        var translation = {'language': data.article.language, 'id': data.article.id};
        data.article.id = null;
        if (data.article.translations == null || data.article.translations == undefined) {
          data.article.translations = [translation];
        } else {
          data.article.translations.push(translation);
        }
        return _this.article = data.article;
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to get article: " + error);
      };
    })(this));
  };
  return CreateArticleCtrl;
}()]);

controllersModule.controller('ArticleCtrl', ['$log', '$alert', 'TranslationService', 'ArticleService', function() {
  function ArticleCtrl($log, $alert, TranslationService, ArticleService) {
    this.$log = $log;
    this.$alert = $alert;
    this.ArticleService = ArticleService;
    this.TranslationService = TranslationService;
    this.articles = [];
    this.languages = TranslationService.supportedLanguages();
    this.active = ['Active', 'Inactive'];
    this.selLang =  this.TranslationService.getLanguage();
    this.selActive = 0;
    this.list();
  }

  ArticleCtrl.prototype.changeLanguage = function (key) {
    this.TranslationService.changeLanguage(key);
    this.selLang = key;
    this.list();
  };

  ArticleCtrl.prototype.selectLanguage = function(index) {
    this.selLang = this.languages[index];
    this.list();
  };

  ArticleCtrl.prototype.selectActive = function(index) {
    this.selActive = index;
    this.list();
  };

  ArticleCtrl.prototype.list = function() {
    this.articles.length = 0;
    return this.ArticleService.list({
        'active': (this.active[this.selActive] == 'Active')? true:false,
        'language': this.selLang
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
}()]);

