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
  function AlbumCtrl($log, $modal) {
    this.$log = $log;
    this.$modal = $modal;
    this._objs = [];
    this.list();
  }

  AlbumCtrl.prototype.list = function() {
    this._objs = [
      {'src':'http://bbg-vintage-racing.s3-website-us-east-1.amazonaws.com/images/photos/2010/concorso-d-eleganza/_DSC0001.jpg'},
      {'src':'http://bbg-vintage-racing.s3-website-us-east-1.amazonaws.com/images/photos/2010/concorso-d-eleganza/_DSC0005.jpg'},
      {'src':'http://bbg-vintage-racing.s3-website-us-east-1.amazonaws.com/images/photos/2010/concorso-d-eleganza/_DSC0011.jpg'},
      {'src':'http://bbg-vintage-racing.s3-website-us-east-1.amazonaws.com/images/photos/2010/concorso-d-eleganza/_DSC0026.jpg'},
      {'src':'http://bbg-vintage-racing.s3-website-us-east-1.amazonaws.com/images/photos/2010/concorso-d-eleganza/_DSC0033.jpg'},
      {'src':'http://bbg-vintage-racing.s3-website-us-east-1.amazonaws.com/images/photos/2010/concorso-d-eleganza/_DSC0037.jpg'},
      {'src':'http://bbg-vintage-racing.s3-website-us-east-1.amazonaws.com/images/photos/2010/concorso-d-eleganza/_DSC0040.jpg'},
      {'src':'http://bbg-vintage-racing.s3-website-us-east-1.amazonaws.com/images/photos/2010/concorso-d-eleganza/_DSC0056.jpg'},
    ];
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
            images: this._objs,
            index: index
          }
      });

  };
  return AlbumCtrl;
})();
controllersModule.controller('AlbumCtrl', ['$log', '$modal', AlbumCtrl]);



var AlbumPreviewCtrl =  (function() {
  function AlbumPreviewCtrl($log) {
    this.$log = $log;
    this._objs = [];
    this.list();
  }

  AlbumPreviewCtrl.prototype.list = function() {
    this._objs = [
      {
        "src":"http://bbg-vintage-racing.s3-website-us-east-1.amazonaws.com/images/photos/2010/concorso-d-eleganza/_DSC0001.jpg",
        "title": "Concorso d'Eleganza",
        "count": 8
      },
      {
        "src":"http://bbg-vintage-racing.s3-website-us-east-1.amazonaws.com/images/photos/2010/campo-di-fiori/CAMPO DI FIORI-03.jpg",
        "title": "Campo Di Fiori",
        "count": 18
      },
      {
        "src":"http://bbg-vintage-racing.s3-website-us-east-1.amazonaws.com/images/photos/2010/mantova-ix/_DSC0003.jpg",
        "title": "Mantova IX",
        "count": 35
      },
    ];
  };

  return AlbumPreviewCtrl;
})();
controllersModule.controller('AlbumPreviewCtrl', ['$log', AlbumPreviewCtrl]);
