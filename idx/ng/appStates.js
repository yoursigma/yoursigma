var appStates = angular.module('idx.appStates', ['ui.router']);

appStates.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider
    .when('/', '/student')
    .otherwise('/student');
  $stateProvider
  .state('index', {
    url: '/',
    abstract: true
  })
  .state('index.idx', { //PhantomJS Ready
    url: "",
    abstract: true,
    views: {
      '@': {
        templateUrl: '/idx/partials/idx.html',
        resolve: {
          setTitle: ['$rootScope', '$window', function(rootScope, $window) {
            $window.document.title = 'YourSigma';
          }],
          setCustomerType: ['$rootScope', function(rootScope) {
            rootScope.customerType = 'student';
          }]
        },
        controller: ['$rootScope', '$scope', 'registrationAPI', '$window', '$timeout', function(rootScope, scope, registrationAPI, $window, $timeout){

          $('#intro').css({'height':($(window).height())+'px'});

          scope.$watch('$state.current.scrollTo', function(value) {
            if (value)
              scope.scrollTo(value);
          });

          scope.$watch('$state.current.customerType', function(value) {
            if (value)
              rootScope.customerType = value;
          });

          //For PhantomJS
          rootScope.status = 'ready';
        }]
      },
      'navbar_links@': {
        templateUrl: '/idx/partials/idx_navbar.html'
      },
      'footer_links@': {
        templateUrl: '/idx/partials/idx_footer.html'
      }
    }
  })
  .state('index.idx.student', {
    url: "student",
    customerType: 'student'
  })
    .state('index.idx.student.features', {
      url: "/features",
      scrollTo: "#features-top"
    })
    .state('index.idx.student.courses', {
      url: "/courses",
      scrollTo: "#courses-top"
    })
    .state('index.idx.student.contact', {
      url: "/contact",
      scrollTo: "#contact-top"
    })
  .state('index.idx.educator', {
    url: "educator",
    customerType: 'educator'
  })
    .state('index.idx.educator.features', {
      url: "/features",
      scrollTo: "#features-top"
    })
    .state('index.idx.educator.courses', {
      url: "/courses",
      scrollTo: "#courses-top"
    })
    .state('index.idx.educator.contact', {
      url: "/contact",
      scrollTo: "#contact-top"
    })
  .state('index.idx.business', {
    url: "business",
    customerType: 'business'
  })
    .state('index.idx.business.features', {
      url: "/features",
      scrollTo: "#features-top"
    })
    .state('index.idx.business.courses', {
      url: "/courses",
      scrollTo: "#courses-top"
    })
    .state('index.idx.business.contact', {
      url: "/contact",
      scrollTo: "#contact-top"
    })
  // .state('index.idx.features', {
  //   url: "features",
  //   scrollTo: "#features-top"
  // })
  // .state('index.idx.courses', {
  //   url: "courses",
  //   scrollTo: "#courses-top"
  // })
  // .state('index.idx.contact', {
  //   url: "contact",
  //   scrollTo: "#contact-top"
  // })
  .state('catalog', { //PhantomJS Ready
    url: "/catalog",
    views: {
      '': {
        templateUrl: '/idx/partials/catalog.html',
        resolve: {
          setTitle: ['$window', function($window) {
            $window.document.title = 'Course Catalog';
          }]
        },
        controller: ['$scope', '$rootScope', function(scope, rootScope){

          rootScope.status = 'ready';
        }]
      },
      'navbar_links': {
        templateUrl: '/idx/partials/other_navbar.html'
      },
      'footer_links': {
        templateUrl: '/idx/partials/other_footer.html'
      }
    }
  })
  .state('courses', { //PhantomJS Ready
    url: "/courses/{courseLabel}",
    views: {
      '': {
        templateUrl: '/idx/partials/courses.html',
        resolve:{
          'coursesRes': ['$rootScope', '$window', '$stateParams', 'coursesAPI', function(rootScope, $window, $stateParams, coursesAPI){
            return coursesAPI.promise.then(function() {
              rootScope.course = findCourse(rootScope.courses, $stateParams.courseLabel);
              if (rootScope.course) {
                $window.document.title = rootScope.course.Name;
                if (!rootScope.course.Lessons) {
                  coursesAPI.getLessonNames(rootScope.course.Id).then(function(value) {
                    rootScope.course.Lessons = value;
                  });
                }
              }
              else if (rootScope.customerType)
                rootScope.$state.transitionTo('index.idx.'+rootScope.customerType);
              else
                rootScope.$state.transitionTo('index.idx.student');
            });
          }]
        },
        controller: ['$scope', '$rootScope', '$stateParams', 'registrationAPI', function(scope, rootScope, stateParams, registrationAPI){

          rootScope.addSubscription = function() {
            if (rootScope.testIds.indexOf(rootScope.$eval('course.Id') < 0)) {
              rootScope.testIds.push(rootScope.course.Id);
              rootScope.selectedTests.push(rootScope.course);
            }
          };

          rootScope.status = 'ready';
        }]
      },
      'navbar_links': {
        templateUrl: '/idx/partials/other_navbar.html'
      },
      'footer_links': {
        templateUrl: '/idx/partials/other_footer.html'
      }
    }
  })
  .state('about', { //PhantomJS Ready
    url: "/about",
    views: {
      '': {
        templateUrl: '/idx/partials/about.html',
        resolve: {
          setTitle: ['$window', function($window) {
            $window.document.title = 'About YourSigma';
          }]
        },
        controller: ['$scope', '$rootScope', function(scope, rootScope){

          rootScope.status = 'ready';
        }]
      },
      'navbar_links': {
        templateUrl: '/idx/partials/other_navbar.html'
      },
      'footer_links': {
        templateUrl: '/idx/partials/other_footer.html'
      }
    }
  })
  .state('learning_features', { //PhantomJS Ready
    url: "/learning_features",
    views: {
      '': {
        templateUrl: '/idx/partials/student_features.html',
        resolve: {
          setTitle: ['$window', function($window) {
            $window.document.title = 'Learning Features';
          }]
        },
        controller: ['$scope', '$rootScope', function(scope, rootScope){

          rootScope.status = 'ready';
        }]
      },
      'navbar_links': {
        templateUrl: '/idx/partials/other_navbar.html'
      },
      'footer_links': {
        templateUrl: '/idx/partials/other_footer.html'
      }
    }
  })
  // .state('teaching_features', {
  //   url: "/teaching_features",
  //   views: {
  //     '': {
  //       templateUrl: '/idx/partials/about.html',
  //       resolve: {
  //         setTitle: ['$window', function($window) {
  //           $window.document.title = 'About YourSigma';
  //         }]
  //       },
  //       controller: ['$scope', function(scope){
  //       }]
  //     },
  //     'navbar_links': {
  //       templateUrl: '/idx/partials/other_navbar.html'
  //     },
  //     'footer_links': {
  //       templateUrl: '/idx/partials/other_footer.html'
  //     }
  //   }
  // })
  .state('policies', { //PhantomJS Ready
    url: "/policies",
    views: {
      '': {
        templateUrl: '/idx/partials/policies.html',
        resolve: {
          setTitle: ['$window', function($window) {
            $window.document.title = 'Policies';
          }]
        },
        controller: ['$scope', '$rootScope', function(scope, rootScope){

          rootScope.status = 'ready';
        }]
      },
      'navbar_links': {
        templateUrl: '/idx/partials/other_navbar.html'
      },
      'footer_links': {
        templateUrl: '/idx/partials/other_footer.html'
      }
    }
  })
  .state('pricing', { //PhantomJS Ready
    url: "/pricing",
    views: {
      '': {
        templateUrl: '/idx/partials/pricing.html',
        resolve: {
          setTitle: ['$window', function($window) {
            $window.document.title = 'Pricing';
          }]
        },
        controller: ['$scope', '$rootScope', function(scope, rootScope){

          rootScope.status = 'ready';
        }]
      },
      'navbar_links': {
        templateUrl: '/idx/partials/other_navbar.html'
      },
      'footer_links': {
        templateUrl: '/idx/partials/other_footer.html'
      }
    }
  })
  .state('payment', {
    url: "/payment",
    views: {
      '': {
        templateUrl: '/idx/partials/payment.html',
        resolve: {
          setTitle: ['$window', function($window) {
            $window.document.title = 'Subscribe';
          }],
          'paymentRes': ['coursesAPI', function(coursesAPI) {
            return coursesAPI.promise;
          }]
        },
        controller: ['$scope', '$rootScope', 'registrationAPI', function(scope, rootScope, registrationAPI){

          scope.firstname = '';
          scope.lastname = '';
          scope.street = '';
          scope.street2 = '';
          scope.city = '';
          scope.state = '';
          scope.zip = '';
          scope.country = 'US';
          scope.couponCode = '';
          scope.creditCardNumber = '';
          scope.month = '';
          scope.year = '';
          scope.creditCardCode = '';
          scope.totalMonthlyCost = 0.00;
          scope.firstMonthCost = 0.00;

          if (rootScope.$stateParams.courseIds) {
            //Separate by +s
            var courseIds = rootScope.$stateParams.courseIds.split('+');
            angular.forEach(courseIds, function(courseId) {
              var course = findCourse(rootScope.courses, rootScope.$eval(courseId));
              if (course && (rootScope.testIds.indexOf(rootScope.$eval(courseId)) < 0)) {
                rootScope.testIds.push(course.Id);
                rootScope.selectedTests.push(course);
              }
            });
          }

          scope.$watch('rootScope.selectedTests.length', function(value) {
            if (value === 0) {
              if (rootScope.customerType)
                rootScope.$state.transitionTo('index.idx.'+rootScope.customerType);
              else
                rootScope.$state.transitionTo('index.idx.student');
            }
          });

          if (rootScope.selectedTests.length === 0) {
            if (rootScope.customerType)
              rootScope.$state.transitionTo('index.idx.'+rootScope.customerType);
            else
              rootScope.$state.transitionTo('index.idx.student');
          }

          for (var i in rootScope.selectedTests)
            scope.totalMonthlyCost += rootScope.selectedTests[i].Price;
          scope.totalMonthlyCost = Math.round(Math.ceil(scope.totalMonthlyCost * 100))/100;
          scope.firstMonthCost = angular.copy(scope.totalMonthlyCost);

          rootScope.submitCouponCode = function() {
            scope.registration.GetCoupon(scope.couponCode, function(response) {
              scope.$apply(function() {
                if (response && response.result) {
                  scope.couponInvalid = false;
                  scope.couponValid = true;
                  if (rootScope.selectedTests && response.result.TestIds) {
                    for (var i in rootScope.selectedTests) {
                      for (var j in response.result.TestIds) {
                        if (rootScope.selectedTests[i].Id == response.result.TestIds[j]) {
                          if (response.result.CouponValue > 0) {
                            scope.firstMonthCost = ((scope.totalMonthlyCost * 100) - (response.result.CouponValue * 100))/100;
                          }
                          else if (response.result.CouponRate > 0) {
                            var priceDiff = scope.selectedTests[i].Price - (scope.selectedTests[i].Price * ( 1 - response.result.CouponRate));
                            scope.firstMonthCost = scope.totalMonthlyCost - priceDiff;
                          }
                        }
                      }
                    }
                  }
                }
                else {
                  scope.couponInvalid = true;
                  scope.couponValid = false;
                }
              });
            });
          };

          rootScope.submitPayment = function() {
            rootScope.registration.SubmitPayment(scope.firstname, scope.lastname, scope.street, scope.street2,scope.city, scope.state, scope.zip, scope.country, scope.couponCode, scope.creditCardNumber, scope.month, scope.year, scope.creditCardCode, rootScope.testIds, undefined, undefined, undefined, function (response) {
              if (!response || response.error || response.id == null) {
                if (response && response.error)
                  rootScope.alertError = response.error.message;
              }
              else {
                $('#payment_modal').modal();
                rootScope.selectedTests = [];
                rootScope.testIds = [];
                rootScope.removeAll();
              }
            });
          };
        }]
      },
      'navbar_links': {
        templateUrl: '/idx/partials/other_navbar.html'
      },
      'footer_links': {
        templateUrl: '/idx/partials/other_footer.html'
      }
    }
  })
  .state('payment.courses', {
    url: "/{courseIds}"
  });
}]);