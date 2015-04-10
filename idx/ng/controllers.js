'use strict';

var controllers = angular.module('idx.controllers', []);

controllers.controller('idxCtrl', ['$rootScope', '$scope', '$window', 'registrationAPI', 'coursesAPI', 'localStorageService', function (rootScope, scope, $window, registrationAPI, coursesAPI, localStorageService){

  rootScope.loadVideo = function(url) {
    if (rootScope.videoUrl != url && rootScope.videoPlayer)
      rootScope.videoPlayer.dispose();
    rootScope.videoUrl = url;
  };

  $('#video_modal').on('hidden', function () {
    rootScope.videoPlayer.pause();
  });

  rootScope.scrollTo = function(id) {
    var top = $(id).offset().top - 61;
    $('html, body').animate({ scrollTop: top }, 800);
  };

  rootScope.alertBlock = '';
  rootScope.alertInfo = '';
  rootScope.alertError = '';
  rootScope.alertSuccess = '';

  rootScope.removeAlert = function(type) {
    switch(type) {
    case 'block':
      rootScope.alertBlock = '';
      break;
    case 'info':
      rootScope.alertInfo = '';
      break;
    case 'error':
      rootScope.alertError = '';
      break;
    case 'success':
      rootScope.alertSuccess = '';
      break;
    }
  };

  rootScope.handleError = function(error) {
    rootScope.$apply(function() {
      debugger;
      if (error.message)
        rootScope.alertError = error.message;
      else if (error.status)
        rootScope.alertError = 'Sorry, the system is down for maintenance. Please try again later!';
    });
  };

  //Initialize
  rootScope.selectedTests = [];
  rootScope.testIds = [];

  rootScope.introHeight = {height: rootScope.$window.innerHeight+'px'};
  $(window).resize(function(){
    rootScope.$apply(function() {
      rootScope.introHeight = {height: rootScope.$window.innerHeight+'px'};
    });
  });

  rootScope.showDashboard = function() {
    if (rootScope.loginUser)
      mixpanel.alias(rootScope.loginUser.username);
    $window.location.href = '/app/#/ys/dashboard/practice';
  };
  rootScope.clickLogo = function() {
    if (rootScope.$state.includes('index.idx')) {
      var top = $('#intro').offset().top - 61;
      $('html, body').animate({ scrollTop: top }, 800);
    }
    else if (rootScope.customerType)
      rootScope.$state.transitionTo('index.idx.'+rootScope.customerType);
    else
      rootScope.$state.transitionTo('index.idx.student');
  };
  rootScope.register = function() {
    rootScope.checkingOut = true;
    $.post('/login_check')
      .done(function() {
        rootScope.$apply(function() {
          rootScope.$state.transitionTo('payment');
        });
      })
      .fail(function(){
        $('#login_modal').modal();
      });
  };

  rootScope.removeAll = function(index) {
    rootScope.selectedTests = [];
    rootScope.testIds = [];
  };

  rootScope.checkLogin = function() {
    $.post('/login_check')
      .done(rootScope.showDashboard)
      .fail(function(){
        $('#login_modal').modal();
      });
  };

  rootScope.contactForm = {
    name: '',
    email: '',
    message: ''};
  rootScope.submitContactForm = function() {
    rootScope.registration.SubmitMessage(rootScope.contactForm.name, rootScope.contactForm.email, rootScope.contactForm.message, function(response) {
      if (!response || response.error) {
        rootScope.handleError(response.error);
      }
      else {
        rootScope.$apply(function() {
          rootScope.messageConfirmed = true;
          $('#general_modal').modal();
        });
      }
    });
  };

  $('#general_modal').on('hidden', function () {
    rootScope.$apply(function() {
      rootScope.messageConfirmed = false;
      rootScope.contactForm = {
        name: '',
        email: '',
        message: ''};
    });
  });

  window.onbeforeunload = function(){
    if (localStorageService.isSupported && !angular.isUndefined(rootScope.testIds))
      localStorageService.add('yoursigma-selectedtests',rootScope.testIds);
  };


}]);

controllers.controller('loginCtrl', ['$rootScope', '$scope', 'registrationAPI', function (rootScope, scope, registrationAPI){

  // Login Modal
  $('#login_modal').on('hidden', function () {
    scope.$apply(function() {
      scope.forgotPassword = false;
      scope.forgotPasswordError = '';
      scope.resetConfirmed = false;
      scope.loginError = '';
      scope.loginUser = {
        'username': '',
        'password': ''
      };
    });
  });

  scope.forgotPasswordEmail = '';
  scope.forgotPassword = false;
  scope.forgotPasswordError = '';
  scope.resetConfirmed = false;
  scope.loginError = '';
  scope.loginUser = {
    'username': '',
    'password': ''
  };
  scope.toggleForgotPassword = function() {
    scope.forgotPassword = true;
  };


  function loginFailed(data) {
    if (data && data.status == '401') {
      scope.$apply(function () {
        scope.loginError = data.statusText;
      });
    }
    else {
      if (data.status && data.statusText) {
        scope.$apply(function () {
          scope.loginError = data.statusText;
        });
      }
    }
  }

  scope.submitLogin = function() {
    if (scope.forgotPassword === true) {
      var requestData = scope.forgotPasswordEmail;
      $.post('/resetpw', {'email': requestData})
        .done(function(){
          scope.resetConfirmed = true;
          scope.$apply();
        })
        .fail(function(data) {
          if (data.status && data.statusText) {
            scope.$apply(function() {
              debugger;
              scope.forgotPasswordError = data.statusText;
              scope.loginError = data.statusText;
            });
          }
        });
    }
    else {
      var requestData = scope.loginUser;
      if (rootScope.checkingOut) {
        $.post('/login', requestData)
          .done(function(){
            scope.$apply(function() {
              $('#login_modal').modal('hide');
              scope.$state.transitionTo('payment');
            });
          })
          .fail(loginFailed);
      }
      else {
        $.post('/login', requestData)
          .done(rootScope.showDashboard)
          .fail(loginFailed);
      }
    }
  };

}]);


controllers.controller('signupCtrl', ['$rootScope', '$scope', 'registrationAPI', 'localStorageService', function (rootScope, scope, registrationAPI, localStorageService){
  rootScope.signupError = '';
  rootScope.testId = '';
  // Signup Modal
  $('#signup_modal').on('hidden', function () {
    rootScope.$apply(function() {
      rootScope.validSignup = false;
      rootScope.signupError = '';

      //Reset request form if submitted
      if (rootScope.requestFormSubmitted) {
        rootScope.requestFormSubmitted = false;
        rootScope.requestForm = {
          name: '',
          email: '',
          number: ''
        };
      }
    });
  });

  rootScope.customerIs = function(customerType) {
    rootScope.customerType = customerType;
  };

  rootScope.requestForm = {
    name: '',
    email: '',
    number: ''
  };

  rootScope.submitRequestForm = function() {
    var message = "Interested " + rootScope.customerType + ". Phone number: " + rootScope.requestForm.number;
    rootScope.registration.SubmitMessage(rootScope.requestForm.name, rootScope.requestForm.email, message, function(response) {
      if (!response || response.error) {
        rootScope.handleError(response.error);
      }
      else {
        rootScope.$apply(function() {
          rootScope.requestFormSubmitted = true;
        });
      }
    });
  };

  rootScope.validSignup = false;
  rootScope.signupErrors = '';
  rootScope.signupUser = {
    'username': '',
    'email': '',
    'password': ''
  };
  rootScope.checkSignup = function() {
    rootScope.registration.CheckUserName(rootScope.signupUser.username, rootScope.signupUser.password, rootScope.signupUser.email, function(response) {
      rootScope.$apply(function() {
        if (response && response.result === true) {
          rootScope.signupError = "Sorry, that username has already been taken";
          rootScope.signupUser.username = "";
        }
        else
          rootScope.validSignup = true;
      });
    });
  };
  function signupCallback(response) {
    debugger;
    if (!response || response.error || response.id == null) {
      if (response && response.error) {
        rootScope.signupError = response.error.message;
      }
    }
    else {
      var sessionID = response.result;
      localStorageService.cookie.add('yoursigma-new-user', 'true');
      window.location = 'app#/'+rootScope.testId+'/group_session/' + sessionID;
    }
  }
  rootScope.submitSignup = function(testId) {
    rootScope.testId = testId;
    var sessionName = 'Your First Trial Session';
    rootScope.registration.GetStarted(rootScope.signupUser.username, rootScope.signupUser.password, rootScope.signupUser.email, testId, sessionName, signupCallback);
  };


}]);
