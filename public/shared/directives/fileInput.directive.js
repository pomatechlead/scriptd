(function() {
  'use strict';
  angular
    .module('scriptd')
    .directive('fileInput', function($parse) {
      return {
        restrict: 'A',

        link: function(scope, elem, attrs) {
          elem.bind('change', function() {
            $parse(attrs.fileInput)
              .assign(scope, elem[0].files)
            scope.$apply()
          })
        }
      };
    });
})();
