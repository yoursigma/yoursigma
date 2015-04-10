'use strict';

var services = angular.module('idx.services', []);

services.factory('registrationAPI', ['$rootScope', '$q', '$http', function (rootScope, $q, $http) {

  var deferred = $q.defer();

  $.getScript("/scripts/json/registration_jsonrpc.js")
    .done(function(script, textStatus) {
    rootScope.registration = new Registration('dashboard');
    deferred.resolve();
  })
  .fail(function(jqxhr, settings, exception) {
    rootScope.alertError = "Sorry, the system is currently down for maintenance.";
    deferred.reject();
  });


  return {
    //For 'courses' resolve
    promise: deferred.promise,

    //In no hurry
    getRemaining: ['$rootScope', '$q', function(rootScope, $q) {
      rootScope.registration.GetNonSubscribedTestGroups(function(response) {
        if (!response || response.error || response.result == null) {
          if (response && response.error)
            rootScope.alertError = response.error.message;
        }
        else
          rootScope.nonSubscribedTestGroups = response.result;
      });
    }]
  };
}]);

services.factory('coursesAPI', ['$rootScope', '$q', 'registrationAPI', 'localStorageService', function (rootScope, $q, registrationAPI, localStorageService) {

  var deferred = $q.defer();

  registrationAPI.promise.then(function() {
    rootScope.registration.GetTestGroups(function(response) {
      if (!response || response.error) {
        rootScope.handleError(response.error);
      }
      else {
        rootScope.$apply(function() {
          rootScope.testGroups = response.result;
          rootScope.courses = [];
          angular.forEach(rootScope.testGroups, function(testGroup) {
            angular.forEach(testGroup.Tests, function(course) {
              this.push(course);
            }, rootScope.courses);
          });
          deferred.resolve();
          if (localStorageService.isSupported) {
            var s_value = localStorageService.get('yoursigma-selectedtests');
            if (s_value) {
              rootScope.testIds = s_value;
              angular.forEach(rootScope.testIds, function(id, index) {
                var course = findCourse(rootScope.courses, id);
                if (course) {
                  this.push(course);
                  rootScope.testIds.splice(index, 1, rootScope.$eval(id));
                }
                else
                  rootScope.testIds.splice(index, 1);
              }, rootScope.selectedTests);
            }
          }

        });
      }
    });
  });

  return {
    promise: deferred.promise,
    getLessonNames: function(courseId) {
      var deferred = $q.defer();
      rootScope.registration.getLessonNames(courseId, function(response) {
        if (!response || response.error) {
          rootScope.handleError(response.error);
        }
        else {
          rootScope.$apply(function() {
            deferred.resolve(response.result);
          });
        }
      });
      return deferred.promise;

    }
  };
}]);
