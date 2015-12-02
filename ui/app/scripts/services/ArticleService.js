'use strict';

(function() {
  var ArticleService;

  ArticleService = (function() {
    ArticleService.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    ArticleService.defaultConfig = {
      headers: ArticleService.headers
    };

    function ArticleService($log, $http, $q) {
      this.$log = $log;
      this.$http = $http;
      this.$q = $q;
      this.$log.debug('constructing ArticleService');
    }

    ArticleService.prototype.listArticles = function() {
      var deferred;
      this.$log.debug('listArticles()');
      deferred = this.$q.defer();
      this.$http.get('/api/articles').success((function(_this) {
        return function(data, status, headers) {
          _this.$log.info('Successfully listed Articles - status ' + status);
          return deferred.resolve(data);
        };
      })(this)).error((function(_this) {
        return function(data, status, headers) {
          _this.$log.error('Failed to list Articles - status ' + status);
          return deferred.reject(data);
        };
      })(this));
      return deferred.promise;
    };

    ArticleService.prototype.showArticle = function(id) {
      var deferred;
      deferred = this.$q.defer();
      this.$http.get('/api/article/' + id).success((function(_this) {
        return function(data, status, headers) {
          return deferred.resolve(data);
        };
      })(this)).error((function(_this) {
         return function(data, status, headers) {
           return deferred.reject(data);
         };
      })(this));;
      return deferred.promise;
    };

    ArticleService.prototype.createArticle = function(article) {
      var deferred;
      this.$log.debug('createArticle ' + (angular.toJson(article, true)));
      deferred = this.$q.defer();
      this.$http.post('/api/article', article).success((function(_this) {
        return function(data, status, headers) {
          _this.$log.info('Successfully created Article - status ' + status);
          return deferred.resolve(data);
        };
      })(this)).error((function(_this) {
        return function(data, status, headers) {
          _this.$log.error('Failed to create article - status ' + status);
          return deferred.reject(data);
        };
      })(this));
      return deferred.promise;
    };

    ArticleService.prototype.deleteArticle = function(id) {
      var deferred;
      deferred = this.$q.defer();
      this.$http.delete('/api/article/delete/' + id).success((function(_this) {
        return function(data, status, headers) {
          _this.$log.info('Successfully deleted Article - status ' + status);
          return deferred.resolve(data);
        };
      })(this));
      return deferred.promise;
    };

    ArticleService.prototype.updateArticle = function(id, article) {
      var deferred;
      this.$log.debug('updateArticle ' + (angular.toJson(article, true)));
      deferred = this.$q.defer();
      this.$http.put('/api/article/' + id, article).success((function(_this) {
        return function(data, status, headers) {
          _this.$log.info('Successfully updated Article - status ' + status);
          return deferred.resolve(data);
        };
      })(this)).error((function(_this) {
        return function(data, status, header) {
          _this.$log.error('Failed to update Article - status ' + status);
          return deferred.reject(data);
        };
      })(this));
      return deferred.promise;
    };

    return ArticleService;

  })();

  servicesModule.service('ArticleService', ['$log', '$http', '$q', ArticleService]);

}).call(this);
