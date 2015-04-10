/**
 * AngularStrap - Twitter Bootstrap directives for AngularJS
 * @version v0.7.6 - 2013-09-25
 * @link http://mgcrea.github.com/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function (window, document, undefined) {
  'use strict';
  angular.module('$strap.config', []).value('$strapConfig', {});
  angular.module('$strap.filters', ['$strap.config']);
  angular.module('$strap.directives', ['$strap.config']);
  angular.module('$strap', [
    '$strap.filters',
    '$strap.directives',
    '$strap.config'
  ]);
  angular.module('$strap.directives').directive('bsDatepicker', [
    '$timeout',
    '$strapConfig',
    function ($timeout, $strapConfig) {
      var isAppleTouch = /(iP(a|o)d|iPhone)/g.test(navigator.userAgent);
      var regexpMap = function regexpMapFn(language) {
        language = language || 'en';
        return {
          '/': '[\\/]',
          '-': '[-]',
          '.': '[.]',
          ' ': '[\\s]',
          'dd': '(?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1}))',
          'd': '(?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1}))',
          'mm': '(?:[0]?[1-9]|[1][012])',
          'm': '(?:[0]?[1-9]|[1][012])',
          'DD': '(?:' + $.fn.datepicker.dates[language].days.join('|') + ')',
          'D': '(?:' + $.fn.datepicker.dates[language].daysShort.join('|') + ')',
          'MM': '(?:' + $.fn.datepicker.dates[language].months.join('|') + ')',
          'M': '(?:' + $.fn.datepicker.dates[language].monthsShort.join('|') + ')',
          'yyyy': '(?:(?:[1]{1}[0-9]{1}[0-9]{1}[0-9]{1})|(?:[2]{1}[0-9]{3}))(?![[0-9]])',
          'yy': '(?:(?:[0-9]{1}[0-9]{1}))(?![[0-9]])'
        };
      };
      var regexpForDateFormat = function regexpForDateFormatFn(format, language) {
        var re = format, map = regexpMap(language), i;
        i = 0;
        angular.forEach(map, function (v, k) {
          re = re.split(k).join('${' + i + '}');
          i++;
        });
        i = 0;
        angular.forEach(map, function (v, k) {
          re = re.split('${' + i + '}').join(v);
          i++;
        });
        return new RegExp('^' + re + '$', ['i']);
      };
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function postLink(scope, element, attrs, controller) {
          var options = angular.extend({ autoclose: true }, $strapConfig.datepicker || {}), type = attrs.dateType || options.type || 'date';
          angular.forEach([
            'format',
            'weekStart',
            'calendarWeeks',
            'startDate',
            'endDate',
            'daysOfWeekDisabled',
            'autoclose',
            'startView',
            'minViewMode',
            'todayBtn',
            'todayHighlight',
            'keyboardNavigation',
            'language',
            'forceParse'
          ], function (key) {
            if (angular.isDefined(attrs[key]))
              options[key] = attrs[key];
          });
          var language = options.language || 'en', readFormat = attrs.dateFormat || options.format || $.fn.datepicker.dates[language] && $.fn.datepicker.dates[language].format || 'mm/dd/yyyy', format = isAppleTouch ? 'yyyy-mm-dd' : readFormat, dateFormatRegexp = regexpForDateFormat(format, language), ISODateRegexp = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
          if (controller) {
            controller.$formatters.unshift(function (modelValue) {
              if (modelValue && type === 'iso' && ISODateRegexp.test(modelValue)) {
                return $.fn.datepicker.DPGlobal.parseDate(new Date(modelValue), $.fn.datepicker.DPGlobal.parseFormat(readFormat), language);
              } else if (modelValue && type === 'date' && angular.isString(modelValue)) {
                return $.fn.datepicker.DPGlobal.parseDate(modelValue, $.fn.datepicker.DPGlobal.parseFormat(readFormat), language);
              } else {
                return modelValue;
              }
            });
            controller.$parsers.unshift(function (viewValue) {
              if (!viewValue) {
                controller.$setValidity('date', true);
                return null;
              } else if ((type === 'date' || type === 'iso') && angular.isDate(viewValue)) {
                controller.$setValidity('date', true);
                return viewValue;
              } else if (angular.isString(viewValue) && dateFormatRegexp.test(viewValue)) {
                controller.$setValidity('date', true);
                if (isAppleTouch)
                  return new Date(viewValue);
                return type === 'string' ? viewValue : $.fn.datepicker.DPGlobal.parseDate(viewValue, $.fn.datepicker.DPGlobal.parseFormat(format), language);
              } else {
                controller.$setValidity('date', false);
                return undefined;
              }
            });
            controller.$render = function ngModelRender() {
              if (isAppleTouch) {
                var date = controller.$viewValue ? $.fn.datepicker.DPGlobal.formatDate(controller.$viewValue, $.fn.datepicker.DPGlobal.parseFormat(format), language) : '';
                element.val(date);
                return date;
              }
              if (!controller.$viewValue)
                element.val('');
              return element.datepicker('update', controller.$viewValue);
            };
          }
          if (isAppleTouch) {
            element.prop('type', 'date').css('-webkit-appearance', 'textfield');
          } else {
            if (controller) {
              element.on('changeDate', function (ev) {
                scope.$apply(function () {
                  controller.$setViewValue(type === 'string' ? element.val() : ev.date);
                });
              });
            }
            element.datepicker(angular.extend(options, {
              format: format,
              language: language
            }));
            scope.$on('$destroy', function () {
              var datepicker = element.data('datepicker');
              if (datepicker) {
                datepicker.picker.remove();
                element.data('datepicker', null);
              }
            });
            attrs.$observe('startDate', function (value) {
              element.datepicker('setStartDate', value);
            });
            attrs.$observe('endDate', function (value) {
              element.datepicker('setEndDate', value);
            });
          }
          var component = element.siblings('[data-toggle="datepicker"]');
          if (component.length) {
            component.on('click', function () {
              if (!element.prop('disabled')) {
                element.trigger('focus');
              }
            });
          }
        }
      };
    }
  ]);
}(window, document));