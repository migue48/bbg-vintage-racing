/**
  * Copyright (C) 2015-2016 Miguel Osorio. All rights reserved.
  */
'use strict';
servicesModule.service('AlbumService', ['$log', '$http', '$q', ServiceTemplate('/api/albums')]);
