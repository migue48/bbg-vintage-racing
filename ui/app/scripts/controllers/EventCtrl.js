'use strict';

controllersModule.controller('UpdateEventCtrl', ['$log', '$location', '$stateParams', 'EventService', 'TranslationService', function() {
  function UpdateEventCtrl($log, $location, $stateParams, EventService, TranslationService) {
    this.$log = $log;
    this.$location = $location;
    this.$stateParams = $stateParams;
    this.Service = EventService;
    this.TranslationService = TranslationService;
    this._obj = {};
    this.get(this.$stateParams.id);
  }

  UpdateEventCtrl.prototype.update = function() {
    this._obj.active = true;
    return this.Service.update(this.$stateParams.id, this._obj).then((function(_this) {
      return function(data) {
        return _this.$location.path("/admin/events");
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to update event: " + error);
      };
    })(this));
  };

  UpdateEventCtrl.prototype.get = function(id) {
    return this.Service.show(id).then((function(_this) {
      return function(data) {
        return _this._obj = data.event;
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to get event: " + error);
      };
    })(this));
  };
  return UpdateEventCtrl;
}()]);

controllersModule.controller('EventShowCtrl', ['$log', '$stateParams', 'EventService', function() {
 function EventShowCtrl($log, $stateParams, EventService) {
   this.$log = $log;
   this.$stateParams = $stateParams;
   this.Service = EventService;
   this._obj = {};
   this.get(this.$stateParams.id);
 }

 EventShowCtrl.prototype.get = function(id) {
   return this.Service.show(id).then((function(_this) {
     return function(data) {
       return _this._obj = data.event;
     };
   })(this), (function(_this) {
     return function(error) {
       return _this.$log.error("Unable to get event: " + error);
     };
   })(this));
 };
 return EventShowCtrl;
}()]);

controllersModule.controller('EventDeleteCtrl', ['$log', '$stateParams', '$location', 'EventService', function() {
  function EventDeleteCtrl($log, $stateParams, $location, EventService) {
    this.$log = $log;
    this.Service = EventService;
    this.$stateParams = $stateParams;
    this.$location = $location;
    this.destroy();
  }

  EventDeleteCtrl.prototype.destroy = function() {
    return this.Service.destroy(this.$stateParams.id).then((function(_this) {
      return function(data) {
        return _this.$location.path("/admin/events");
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to delete event: " + error);
      };
    })(this));
  };

  return EventDeleteCtrl;
}()]);

controllersModule.controller('CreateEventCtrl', ['$rootScope', '$log', '$location', '$stateParams', 'EventService', 'TranslationService', function() {
  function CreateEventCtrl($rootScope, $log, $location, $stateParams, EventService, TranslationService) {
    this.$log = $log;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$stateParams = $stateParams;
    this.Service = EventService;
    this.TranslationService = TranslationService;
    this.languages = this.TranslationService.supportedLanguages();
    this.refId = $stateParams.id;
    this._obj = {};
    if (this.refId === undefined || this.refId === null) {
      this._obj.language = 'en';
      this._obj.active = true;
      return;
    }
    this.get(this.refId);
  }

  CreateEventCtrl.prototype.create = function() {
    this._obj.userId = this.$rootScope.user.userID;
    return this.Service.create(this._obj).then((function(_this) {
      return function(data) {
        return _this.$location.path('/admin/events');
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to create event: " + error);
      };
    })(this));
  };

  CreateEventCtrl.prototype.get = function(id) {
    return this.Service.show(id).then((function(_this) {
      return function(data) {
        var translation = {'language': data.event.language, 'id': data.event.id};
        data.event.id = null;
        if (data.event.translations == null || data.event.translations == undefined) {
          data.event.translations = [translation];
        } else {
          data.event.translations.push(translation);
        }
        return _this._obj = data.event;
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to get event: " + error);
      };
    })(this));
  };

  return CreateEventCtrl;
}()]);


controllersModule.controller('EventCtrl', ['$log', 'EventService', 'TranslationService', function() {
 function EventCtrl($log, EventService, TranslationService) {
   this.$log = $log;
   this.Service = EventService;
   this.TranslationService = TranslationService;
   this._objs = [];
   this.languages = TranslationService.supportedLanguages();
   this.active = ['Active', 'Inactive'];
   this.selLang =  this.TranslationService.getLanguage();
   this.selActive = 0;
   this.list();
 }

 EventCtrl.prototype.changeLanguage = function (key) {
   this.TranslationService.changeLanguage(key);
   this.selLang = key;
   this.list();
 };

 EventCtrl.prototype.selectLanguage = function(index) {
   this.selLang = this.languages[index];
   this.list();
 };

 EventCtrl.prototype.selectActive = function(index) {
   this.selActive = index;
   this.list();
 };

 EventCtrl.prototype.list = function() {
   this._objs.length = 0;
   return this.Service.list({
        'active': (this.active[this.selActive] == 'Active')? true:false,
        'language': this.selLang
       }).then((function(_this) {
     return function(data) {
       return _this._objs = data;
     };
   })(this), (function(_this) {
     return function(error) {
       return _this.$log.error("Unable to get list of events: " + error);
     };
   })(this));
 };

 return EventCtrl;
}()]);

controllersModule.controller('CalendarCtrl', ['$rootScope', '$log', '$location', '$anchorScroll', 'EventService', 'TranslationService', function(){
  function CalendarCtrl($rootScope, $log,  $location, $anchorScroll, EventService, TranslationService) {
    this.$log = $log;
    this.$anchorScroll = $anchorScroll;
    this.$location = $location;
    this.Service = EventService;
    this.TranslationService = TranslationService;
    this.cur = {};
    this.events = [];
    this.index = 0;
    this.languages = TranslationService.supportedLanguages();
    this.active = ['Active', 'Inactive'];
    this.selLang =  this.TranslationService.getLanguage();
    this.selActive = 0;
    this.list();
  }

  CalendarCtrl.prototype.changeLanguage = function (key) {
    this.TranslationService.changeLanguage(key);
    this.selLang = key;
    this.list();
  };

  CalendarCtrl.prototype.selectLanguage = function(index) {
    this.selLang = this.languages[index];
    this.list();
  };

  CalendarCtrl.prototype.selectActive = function(index) {
    this.selActive = index;
    this.list();
    };

  CalendarCtrl.prototype.list = function() {
      this.events.length = 0;
      return this.Service.list({
       'active': (this.active[this.selActive] == 'Active')? true:false,
       'language': this.selLang
      }).then((function(_this) {
        return function(data) {
           _this.events = data;
           _this.events.map(function (event) {
             event.dateRange = _this.CalcDateRange(event);
           });
           if (_this.events.length > 0) {
             _this.cur = _this.events[_this.index];
          }
        };
      })(this), (function(_this) {
        return function(error) {
          return _this.$log.error("Unable to get list of events: " + error);
        };
      })(this));
  };

  CalendarCtrl.prototype.CalcDateRange = function(event) {
    var startDate = new Date(event.startDate);
    var endDate = new Date(event.endDate);

    var result = startDate.getDate().toString();
    if (startDate.getMonth() == endDate.getMonth() &&
        startDate.getYear()  == endDate.getYear()  &&
        startDate.getDate()  != endDate.getDate()) {
      result += '-' + endDate.getDate().toString();
    }
    return result;
  };

  // Select action, updates cur variable and updates events scroll
  CalendarCtrl.prototype.SelectEvent = function(index) {
    this.index = index;
    this.cur = this.events[this.index];

    // Update the scroll so that the first event is the one on display.
    this.$location.hash('event'+index);
    this.$anchorScroll();

    // Reset view to show the event starting from the top.
    this.$location.hash('');
    this.$anchorScroll();
  };

  CalendarCtrl.prototype.Down = function() {
    if (this.index < this.events.length - 1) {
      return this.SelectEvent(this.index + 1);
    }
  }

  CalendarCtrl.prototype.Up = function() {
    if (this.index > 0 && this.events.length > 0) {
      return this.SelectEvent(this.index - 1)
    }
  }

  // Find init date function to initialize cur module after getting list of events
  return CalendarCtrl;
}()]);

