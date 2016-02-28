'use strict';


controllersModule.controller('AlbumModalCtrl', ['images', 'index', function() {
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
}()]);

controllersModule.controller('AlbumCtrl', ['$log', '$modal', '$stateParams', 'AlbumService', function() {
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
}()]);

controllersModule.controller('AlbumPreviewCtrl', ['$log', 'AlbumService', 'TranslationService', function() {
  function AlbumPreviewCtrl($log, AlbumService, TranslationService) {
    this.$log = $log;
    this.Service = AlbumService;
    this._objs = [];
    this.TranslationService = TranslationService;
    this.languages = TranslationService.supportedLanguages();
    this.active = ['Active', 'Inactive'];
    this.selLang =  this.TranslationService.getLanguage();
    this.selActive = 0;
    this.list();
  }

  AlbumPreviewCtrl.prototype.changeLanguage = function (key) {
   this.TranslationService.changeLanguage(key);
   this.selLang = key;
   this.list();
  };

  AlbumPreviewCtrl.prototype.selectLanguage = function(index) {
   this.selLang = this.languages[index];
   this.list();
  };

  AlbumPreviewCtrl.prototype.selectActive = function(index) {
   this.selActive = index;
   this.list();
  };

  AlbumPreviewCtrl.prototype.list = function() {
    return this.Service.list({
       'active': (this.active[this.selActive] == 'Active')? true:false,
       'language': this.selLang
      }).then((function(_this) {
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
}()]);


controllersModule.controller('CreateAlbumCtrl', ['$rootScope', '$log', '$location', '$stateParams', 'AlbumService', 'TranslationService', function() {
  function CreateAlbumCtrl($rootScope, $log, $location, $stateParams, AlbumService, TranslationService) {
    this.$log = $log;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.Service = AlbumService;

    this.TranslationService = TranslationService;
    this.languages = this.TranslationService.supportedLanguages();
    this.refId = $stateParams.id;
    this._obj = {};
    if (this.refId === undefined || this.refId === null) {
      this._obj.language = 'en';
      this._obj.active = true;
      this._obj.images = [this.NewImage()];
      return;
    }
    this.get(this.refId);
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
    this._obj.userId = this.$rootScope.user.userID;
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

  CreateAlbumCtrl.prototype.get = function(id) {
    return this.Service.show(id).then((function(_this) {
      return function(data) {
        var translation = {'language': data.album.language, 'id': data.album.id};
        data.album.id = null;
        if (data.album.translations == null || data.album.translations == undefined) {
          data.album.translations = [translation];
        } else {
          data.album.translations.push(translation);
        }
        if (data.album.images == null || data.album.images == undefined) {
          data.album.images = [this.NewImage()];
        }
        return _this._obj = data.album;
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to get album: " + error);
      };
    })(this));
  };

  return CreateAlbumCtrl;
}()]);

controllersModule.controller('UpdateAlbumCtrl', ['$rootScope', '$log', '$location', '$stateParams', 'AlbumService', 'TranslationService',function() {
  function UpdateAlbumCtrl($rootScope, $log, $location, $stateParams, AlbumService, TranslationService) {
    this.$log = $log;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.Service = AlbumService;
    this.TranslationService = TranslationService;
    this._obj = {};
    this._id = $stateParams.id;
    this.get(this._id);
  }

  UpdateAlbumCtrl.prototype.get = function(id) {
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

  UpdateAlbumCtrl.prototype.NewImage = function() {
    return {
      'id':'',
      'src':'',
      'description': '',
      'thumbnail': ''
    };
  };

  UpdateAlbumCtrl.prototype.AddImage = function() {
    this._obj.images.push(this.NewImage());
  };

  UpdateAlbumCtrl.prototype.RemoveImage = function(index) {
    if (index < this._obj.images.length && index >= 0) {
      this._obj.images.splice(index,1);
    }
  };

  UpdateAlbumCtrl.prototype.update = function() {

    // This can be part of a pre-processing function if we want to
    // make the controllers generic.
    this._obj.userId = this.$rootScope.user.userID;
    return this.Service.update(this._id, this._obj).then((function(_this) {
      return function(data) {
        return _this.$location.path('/admin/albums');
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to update album: " + error);
      };
    })(this));
  };
  return UpdateAlbumCtrl;
}()]);

controllersModule.controller('AlbumDeleteCtrl', ['$log', '$stateParams', '$location', 'AlbumService', function() {
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
}()]);
