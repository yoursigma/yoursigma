// Initialize index_html template and make section height of window
$(document).ready(function() {
	// $('#intro').css({'height':($(window).height())+'px'});
	// $(window).resize(function(){
	// $('#intro').css({'height':($(window).height())+'px'});
	// });
	var index_html = $('#index_html').html();

  //Get modals to autofocus
  $('.modal').on('shown', function () {
      $('.modal.in').find("[autofocus]:first").focus();
  });

  //Add Hover effect to menu
  $('#selected_tests_dropdown').hover(function() {
    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn();
  }, function() {
    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut();
  });

});

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

$(window).load(function(){
  preload([
      '/img/boardroom_bg.jpg',
      '/img/ipad_bg.png'
  ]);
});

function findCourse (a, course) {

  for (var i=0; i<a.length; i++) {
    var b = a[i];
    if (angular.uppercase(b.Abbreviation) == angular.uppercase(course)) {
      return b;
    }
    else if (angular.uppercase(b.Filename) == angular.uppercase(course)) {
      return b;
    }
    else if (b.Id == course) {
      return b;
    }
  }
}

// For IE
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(obj, start) {
       for (var i = (start || 0), j = this.length; i < j; i++) {
           if (this[i] === obj) { return i; }
       }
       return -1;
  };
}