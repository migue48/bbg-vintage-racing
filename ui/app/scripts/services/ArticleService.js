'use strict';

servicesModule.service('ArticleService', ['$log', '$http', '$q', ServiceTemplate('/api/articles')]);
