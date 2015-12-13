'use strict';

function ServiceTemplate(nameUrl) {
  var Service;

  Service.headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  Service.defaultConfig = {
    headers: Service.headers
  };

  function Service($log, $http, $q) {
    this.$log = $log;
    this.$http = $http;
    this.$q = $q;
  }

  Service.prototype.list = function() {
    var deferred;
    deferred = this.$q.defer();
    this.$http.get(nameUrl).success((function(_this) {
      return function(data, status, headers) {
        return deferred.resolve(data);
      };
    })(this)).error((function(_this) {
      return function(data, status, headers) {
        _this.$log.error('Failed to get list - status ' + status);
        return deferred.reject(data);
      };
    })(this));
    return deferred.promise;
  };

  Service.prototype.show = function(id) {
    var deferred;
    deferred = this.$q.defer();
    this.$http.get(nameUrl + '/' + id).success((function(_this) {
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

  Service.prototype.create = function(_obj) {
    var deferred;
    deferred = this.$q.defer();
    this.$http.post(nameUrl, _obj).success((function(_this) {
      return function(data, status, headers) {
        return deferred.resolve(data);
      };
    })(this)).error((function(_this) {
      return function(data, status, headers) {
        _this.$log.error('Failed to create object - status ' + status);
        return deferred.reject(data);
      };
    })(this));
    return deferred.promise;
  };

  Service.prototype.destroy = function(id) {
    var deferred;
    deferred = this.$q.defer();
    this.$http.delete(nameUrl + '/delete/' + id).success((function(_this) {
      return function(data, status, headers) {
        return deferred.resolve(data);
      };
    })(this));
    return deferred.promise;
  };

  Service.prototype.update = function(id, _obj) {
    var deferred;
    deferred = this.$q.defer();
    this.$http.put(nameUrl + '/' + id, _obj).success((function(_this) {
      return function(data, status, headers) {
        return deferred.resolve(data);
      };
    })(this)).error((function(_this) {
      return function(data, status, header) {
        _this.$log.error('Failed to update object - status ' + status);
        return deferred.reject(data);
      };
    })(this));
    return deferred.promise;
  };

  return Service;

};
