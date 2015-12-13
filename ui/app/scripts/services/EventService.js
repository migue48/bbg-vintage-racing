'use strict';

servicesModule.service('EventService', ['$log', '$http', '$q', ServiceTemplate('/api/events')]);
