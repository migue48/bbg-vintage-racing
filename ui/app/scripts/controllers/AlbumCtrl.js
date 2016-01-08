'use strict';

var AlbumModalCtrl =  (function() {
  function AlbumModalCtrl(images, index) {
    this.images = images;
    this.index = index;
  }

  AlbumModalCtrl.prototype.next = function() {
    if (this.images.length - 1 == this.index) {
      this.index = 0;
    } else {
      this.index += 1;
    }
  };

  AlbumModalCtrl.prototype.prev = function() {
    if (this.index == 0) {
      this.index = this.images.length;
    } else {
      this.index -= 1;
    }
  };

  return AlbumModalCtrl;
})();
controllersModule.controller('AlbumModalCtrl', ['images', 'index', AlbumModalCtrl]);

var AlbumCtrl =  (function() {
  function AlbumCtrl($log, $modal, $stateParams, AlbumService) {
    this.$log = $log;
    this.$modal = $modal;
    this.Service = AlbumService;
    this._obj = {};
    this.get($stateParams.id);

  }

  AlbumCtrl.prototype.get = function(id) {
    return this.Service.show(id).then((function(_this) {
      return function(data) {
        return _this._obj = data.album;
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to get album: " + error);
      };
    })(this));
  };

  AlbumCtrl.prototype.showModal = function(index) {
    var modal = this.$modal({
        title: '',
        position: 'bottom',
        content: false,
        show: true,
        templateUrl:'/partials/photos/modal.html',
        controller:'AlbumModalCtrl',
        controllerAs: 'c',
        locals: {
            images: this._obj.images,
            index: index
          }
      });

  };
  return AlbumCtrl;
})();
controllersModule.controller('AlbumCtrl', ['$log', '$modal', '$stateParams', 'AlbumService', AlbumCtrl]);



var AlbumPreviewCtrl =  (function() {
  function AlbumPreviewCtrl($log, AlbumService) {
    this.$log = $log;
    this.Service = AlbumService;
    this._objs = [];
    this.list();
  }

  AlbumPreviewCtrl.prototype.list = function() {
    return this.Service.list().then((function(_this) {
      return function(data) {
        return _this._objs = data;
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to get list of albums: " + error);
      };
    })(this));
  };

  return AlbumPreviewCtrl;
})();
controllersModule.controller('AlbumPreviewCtrl', ['$log', 'AlbumService', AlbumPreviewCtrl]);

var CreateAlbumCtrl =  (function() {
  function CreateAlbumCtrl($rootScope, $log, $location, AlbumService) {
    this.$log = $log;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.Service = AlbumService;
    this._obj = {'images': [
      this.NewImage()
    ]};
  }

  CreateAlbumCtrl.prototype.NewImage = function() {
    return {
      'id':'',
      'src':'',
      'description': '',
      'thumbnail': ''
    };
  };

  CreateAlbumCtrl.prototype.AddImage = function() {
    this._obj.images.push(this.NewImage());
  };

  CreateAlbumCtrl.prototype.RemoveImage = function(index) {
    if (index < this._obj.images.length && index >= 0) {
      this._obj.images.splice(index,1);
    }
  };

  CreateAlbumCtrl.prototype.create = function() {

    // This can be part of a pre-processing function if we want to
    // make the controllers generic.
    this._obj.active = true;
    this._obj.language = "en";
    this._obj.userId = this.$rootScope.user.userID;
    this._obj.id = '';

    return this.Service.create(this._obj).then((function(_this) {
      return function(data) {
        return _this.$location.path('/admin/albums');
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to create album: " + error);
      };
    })(this));
  };

  return CreateAlbumCtrl;
})();
controllersModule.controller('CreateAlbumCtrl', ['$rootScope', '$log', '$location', 'AlbumService', CreateAlbumCtrl]);

var AlbumDeleteCtrl = (function() {
  function AlbumDeleteCtrl($log, $stateParams, $location, AlbumService) {
    this.$log = $log;
    this.Service = AlbumService;
    this.$stateParams = $stateParams;
    this.$location = $location;
    this.destroy();
  }

  AlbumDeleteCtrl.prototype.destroy = function() {
    return this.Service.destroy(this.$stateParams.id).then((function(_this) {
      return function(data) {
        return _this.$location.path("/admin/albums");
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to delete album: " + error);
      };
    })(this));
  };

  return AlbumDeleteCtrl;
})();
controllersModule.controller('AlbumDeleteCtrl', ['$log', '$stateParams', '$location', 'AlbumService', AlbumDeleteCtrl]);
