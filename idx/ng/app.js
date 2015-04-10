"use strict";

var app = angular.module('idx', [
  'idx.controllers',
  'idx.filters',
  'idx.directives',
  'idx.services',
  'idx.appStates',
  'idx.animations',
  'ngSanitize',
  'ga',
  'LocalStorageModule'
  ]);

app.run(['$rootScope', '$window', '$location', '$timeout', '$state', '$stateParams', 'ga', function ($rootScope, $window, $location, $timeout, $state, $stateParams, ga) {

  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$window = $window;
  $rootScope.$location = $location;

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    ga('send', 'pageview', {'page': $rootScope.$state.$current.name, 'title': $window.document.title});

  });

}]);

