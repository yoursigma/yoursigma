'use strict';

var filters = angular.module('idx.filters', []);

filters.filter('uniqueSubsubtopic', function () {
    return function (subsubtopics, subtopicName) {
      var array = []
      angular.forEach(subsubtopics, function(subsubtopic) {
        if (subsubtopic.Name != subtopicName)
          this.push(subsubtopic);
      }, array)
      return array;
    };
});

