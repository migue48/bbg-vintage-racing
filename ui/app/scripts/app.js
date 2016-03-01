/**
  * Copyright (C) 2015-2016 Miguel Osorio. All rights reserved.
  */

'use strict';

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-71354204-1', 'auto');

/**
 * The application.
 */
var app = angular.module('uiApp', [
  'ngResource',
  'ngMessages',
  'ngCookies',
  'ui.router',
  'mgcrea.ngStrap',
  'satellizer',
  'uiApp.controllers',
  'uiApp.services',
  'textAngular',
  'angulartics',
  'angulartics.google.analytics',
  'wu.masonry',
  "pascalprecht.translate",
  'articlePreview',
]);


/*
 * Angular translate configuration.  This configures the available
 * translations for the application, sets the default language to 'en'
 * and  enabled cookie storage. The cookie storage is required to get
 * the language selection to persist between reload events.
 */
app.config(function($translateProvider) {
  $translateProvider.useCookieStorage();
  $translateProvider.translations('en', languageEn);
  $translateProvider.translations('it', languageIt);
  $translateProvider.preferredLanguage('en');
  $translateProvider.useSanitizeValueStrategy('sanitize');
})


/**
 * The run configuration.
 */
app.run(function($rootScope, $anchorScroll, $location, $translate, $state, $stateParams) {

  /**
  * The logged in user object.
  */
  $rootScope.user = {};


  // Default offset used as part of the scroll operation.
  $anchorScroll.yOffset = 100;

  /**
   * Root scope function used to implement anchor scroll functionality.
   *
   * @param {string} id HTML id of the target object.
   */
  $rootScope.scrollTo = function(id) {
    $location.hash(id);
    $anchorScroll();
  }

  /**
   * Root scope function used to change the language setting. This function
   * triggers a $state reload event to be able to perform a language switch
   * as part of the controller init flow associated with the given state.
   *
   * @param {string} langKey Language locale code.
   */
  $rootScope.changeLanguage = function (langKey) {
        $translate.use(langKey);
        $state.go($state.current, $stateParams, {reload: true, inherit: false});
  };
});


/**
 * The application routing.
 */
app.config(function ($urlRouterProvider, $stateProvider, $httpProvider, $authProvider) {
  $urlRouterProvider.otherwise('/');

  function authenticationFnc($q, $location, $auth) {
    var deferred = $q.defer();

    if (!$auth.isAuthenticated()) {
      $location.path('/signIn');
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  }

  $stateProvider
    // Admin root page
    .state('admin',         { url: '/admin',  templateUrl: '/partials/admin/admin.html', resolve: { authenticated: authenticationFnc }})

    // Article admin pages
    .state('admin-articles',        { url: '/admin/articles', templateUrl: '/partials/admin/articles/index.html', resolve:  { authenticated: authenticationFnc }})
    .state('admin-articles-edit',   { url: '/admin/articles/update/:id', templateUrl: '/partials/admin/articles/update.html', resolve:  { authenticated: authenticationFnc }})
    .state('admin-articles-new',    { url: '/admin/articles/create', params: { id:null}, templateUrl: '/partials/admin/articles/create.html', resolve:  { authenticated: authenticationFnc }})
    .state('admin-articles-delete', { url: '/admin/articles/delete/:id', template: null, controller: 'ArticleDeleteCtrl', resolve:  { authenticated: authenticationFnc }})

    // Event admin pages
    .state('admin-events',        { url: '/admin/events', templateUrl: '/partials/admin/events/index.html', resolve:  { authenticated: authenticationFnc }})
    .state('admin-events-edit',   { url: '/admin/events/update/:id', templateUrl: '/partials/admin/events/update.html', resolve:  { authenticated: authenticationFnc }})
    .state('admin-events-new',    { url: '/admin/events/create', params: { id:null}, templateUrl: '/partials/admin/events/create.html', resolve:  { authenticated: authenticationFnc }})
    .state('admin-events-delete', { url: '/admin/events/delete/:id', template: null, controller: 'EventDeleteCtrl', resolve:  { authenticated: authenticationFnc }})

    // Album admin pages
    .state('admin-albums',        { url: '/admin/albums', templateUrl: '/partials/admin/albums/index.html', resolve:  { authenticated: authenticationFnc }})
    .state('admin-albums-edit',   { url: '/admin/albums/update/:id', templateUrl: '/partials/admin/albums/update.html', resolve:  { authenticated: authenticationFnc }})
    .state('admin-albums-new',    { url: '/admin/albums/create', params: { id:null}, templateUrl: '/partials/admin/albums/create.html', resolve:  { authenticated: authenticationFnc }})
    .state('admin-albums-delete', { url: '/admin/albums/delete/:id', template: null, controller: 'AlbumDeleteCtrl', resolve:  { authenticated: authenticationFnc }})


    // TODO: Users admin pages go here

    // News
    .state('news-index', { url: '/news',     templateUrl: '/partials/articles/index.html'})
    .state('news-show',  { url: '/news/:id', templateUrl: '/partials/articles/show.html'})

    // Calendar
    .state('calendar-index', { url: '/calendar', templateUrl: '/partials/calendar/index.html'})

    // Photos
    .state('photos-index', { url: '/photos', templateUrl: '/partials/photos/index.html'})
    .state('photos-show',  { url: '/photos/:id', templateUrl: '/partials/photos/show.html'})

    // Root page
    .state('index',             { url:'/',                  templateUrl: '/partials/index.html'})
    .state('contact',           { url:'/call',              templateUrl: '/partials/contact.html'})

    // About pages
    .state('about',             { url:'/about',             templateUrl: '/partials/about/about.html' })

    // User login.
    .state('signUp',  { url: '/signUp',  templateUrl: '/views/signUp.html' })
    .state('signIn',  { url: '/signIn',  templateUrl: '/views/signIn.html' })
    .state('signOut', { url: '/signOut', template: null,  controller: 'SignOutCtrl' })

    .state('otherwise', { abstract: true, templateUrl: '404.html'});

  $httpProvider.interceptors.push(function($q, $injector) {
    return {
      request: function(request) {
        // Add auth token for Silhouette if user is authenticated
        var $auth = $injector.get('$auth');
        if ($auth.isAuthenticated()) {
          request.headers['X-Auth-Token'] = $auth.getToken();
        }

        // Add CSRF token for the Play CSRF filter
        var cookies = $injector.get('$cookies');
        var token = cookies.get('PLAY_CSRF_TOKEN');
        if (token) {
          // Play looks for a token with the name Csrf-Token
          // https://www.playframework.com/documentation/2.4.x/ScalaCsrf
          request.headers['Csrf-Token'] = token;
        }

        return request;
      },

      responseError: function(rejection) {
        if (rejection.status === 401) {
          $injector.get('$state').go('signIn');
        }
        return $q.reject(rejection);
      }
    };
  });

  // Auth config
  $authProvider.httpInterceptor = true; // Add Authorization header to HTTP request
  $authProvider.loginOnSignup = true;
  $authProvider.loginRedirect = '/admin';
  $authProvider.logoutRedirect = '/';
  $authProvider.signupRedirect = '/admin';
  $authProvider.loginUrl = '/signIn';
  $authProvider.signupUrl = '/signUp';
  $authProvider.loginRoute = '/signIn';
  $authProvider.signupRoute = '/signUp';
  $authProvider.tokenName = 'token';
  $authProvider.tokenPrefix = 'bbg-vintage-satellizer'; // Local Storage name prefix
  $authProvider.authHeader = 'X-Auth-Token';
  $authProvider.platform = 'browser';
  $authProvider.storage = 'localStorage';
});

// Modules
this.controllersModule = angular.module('uiApp.controllers', []);
this.servicesModule = angular.module('uiApp.services', []);

