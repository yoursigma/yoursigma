'use strict';

var animations = angular.module('idx.animations', []);

animations.animation('slide-down-enter', function() {
  return {
    setup: function (element) {
        //prepare the element for animation
        element.css({ 'top': '-200%' });
    },
    start: function (element, done, memo) {
        //start the animation
        element.animate({ 'top': 0  }, 400, function () {

            //call when the animation is complete
            done();
        });
    }
  };
});

animations.animation('slide-down-leave', function() {
  return {
    setup: function (element) {
        //prepare the element for animation
    },
    start: function (element, done, memo) {
        //start the animation
        element.animate({ 'top': '200%' }, 400, function () {
            //call when the animation is complete
            done();
        });
    }
  };
});

animations.animation('fade-enter', function() {
  return {
    setup: function (element) {
        var hold = element.parent();
        hold.css({'height': hold.css('height')});

        element.hide();
        //prepare the element for animation
    },
    start: function (element, done, memo) {
        //start the animation
        var hold = element.parent();

        element.delay(400).fadeIn(function () {
            //call when the animation is complete
            hold.css({'height': 'auto'});

            done();
        });
    }
  };
});

animations.animation('fade-leave', function() {
  return {
    setup: function (element) {
        //prepare the element for animation
    },
    start: function (element, done, memo) {
        //start the animation
        element.fadeOut(function () {
            //call when the animation is complete
            done();
        });
    }
  };
});
