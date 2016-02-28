/**
* Copyright (C) 2016 Miguel Osorio. All rights reserved.
*/
'use strict';
servicesModule.service('TranslationService', ['$translate', function() {
  var Service;

  /**
  * Translation Service class used to simplify some of the interactions between the
  * application controllers and the angular-translate $translate service.
  * @param {$translate} $translate service instance.
  */
  function Service($translate) {
    this.$translate = $translate;
    this.languages = ["en", "it"];
    this.labels = {en: "English", it: "Italiano"};
  }

  /**
  * Provide a list of supported languages.
  * @return {list} List of supported language codes.
  */
  Service.prototype.supportedLanguages = function() {
    return this.languages;
  };

  /**
  * Returns user friendly string for a given language code.
  * @return {string} The string user friendly representation of the language code.
  */
  Service.prototype.label = function(key) {
    return this.labels[key];
  };

  /**
  * Returns the current language selection used in the $translate service.
  * @return {string} Standard language code in string format.
  */
  Service.prototype.getLanguage = function () {
    return this.$translate.use();
  };

  /**
  * Changes the language configuration of the $translation service. This
  * function does not return any value.
  * @param {string} key Standard language code.
  */
  Service.prototype.changeLanguage = function(key) {
    this.$translate.use(key);
  };

  return Service;
}()]);
