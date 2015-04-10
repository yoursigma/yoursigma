'use strict';

var directives = angular.module('idx.directives', []);

/*----------------------------------------------------*/
/*  Scrollto
/*----------------------------------------------------*/

directives.directive('scrollto', ['$rootScope', 'ga', function(rootScope, ga){
  return function(scope, elm, attrs) {
    elm.bind('click', function(e){
      if (attrs.scrollto == '' && attrs.href) {
        attrs.scrollto = attrs.href;
      }
      var top = $(attrs.scrollto).offset().top - 61;
      $('html, body').animate({ scrollTop: top }, 800);
    });
    elm.parent('li').on('activate', function() {
      ga('send', 'event', 'section', 'scroll', this.children[0].innerHTML);
    });
  };
}]);

/*----------------------------------------------------*/
/*  Unclick
/*----------------------------------------------------*/

directives.directive('unclick', function() {
    return function(scope, element, attrs) {
        $(element).click(function(event) {
            event.preventDefault();
        });
    }
})

/*----------------------------------------------------*/
/*  Plus/Minus Accordion
/*----------------------------------------------------*/

directives.directive('accordion', [function(){
  return function(scope, elm, attrs) {

    var trigger = elm.find('h5');

    trigger.on('click', function(e) {
      var location = $(this).parent();

        if( $(this).next().is(':hidden') ) {
          $(this).addClass('active').next().slideDown(300);
          $(this).find('i').addClass('icon-minus-sign-alt').removeClass('icon-plus-sign-alt');
        }
        else {
          $(this).removeClass('active').next().slideUp(300);
          $(this).find('i').addClass('icon-plus-sign-alt').removeClass('icon-minus-sign-alt');
        }
        e.preventDefault();
    });
  };
}]);

/*----------------------------------------------------*/
/*  Caret Up/Down Accordion
/*----------------------------------------------------*/

directives.directive('carets', [function(){
  return function(scope, elm, attrs) {

    var trigger = elm.find('h5');

    trigger.on('click', function(e) {
      var location = $(this).parent();

        if( $(this).next().is(':hidden') ) {
          $(this).addClass('active').next().slideDown(300);
          $(this).find('i').addClass('icon-caret-down').removeClass('icon-caret-right');
        }
        else {
          $(this).removeClass('active').next().slideUp(300);
          $(this).find('i').addClass('icon-caret-right').removeClass('icon-caret-down');
        }
        e.preventDefault();
    });
  };
}]);

/*----------------------------------------------------*/
/*  Change Focus
/*----------------------------------------------------*/
directives.directive('ngFocus', function($timeout) {
    return {
        link: function ( scope, element, attrs ) {
            scope.$watch( attrs.ngFocus, function ( val ) {
                if ( angular.isDefined( val ) && val ) {
                    $timeout( function () { element[0].focus(); } );
                }
            }, true);

            element.bind('blur', function () {
                if ( angular.isDefined( attrs.ngFocusLost ) ) {
                    scope.$apply( attrs.ngFocusLost );

                }
            });
        }
    };
});

/*----------------------------------------------------*/
/*  VideoJS
/*----------------------------------------------------*/
directives.directive('video', ['$rootScope', function (rootScope) {
  return {
    link: function(scope, element, attrs) {
      if (rootScope.videoUrl != attrs.source) {
        _V_(attrs.id, scope.$eval(attrs.setup), function(){
          rootScope.videoPlayer = this;
          rootScope.videoPlayer.src([{ type: "video/mp4", src:rootScope.videoUrl}]);
          // rootScope.videoPlayer.play();
        });
      }
    }
  };
}]);

