(function(){
    "use strict";
    angular
        .module("scriptd")
        .controller("SignupFormCtrl", signupFormCtrl);
        function signupFormCtrl(MainService, $scope, $location){
        	var vm = this;

            // ROUTES

        	// FUNCTIONS
            vm.signUp = signUp;

        	//////////////////////////////////////

            function signUp(user){
                $scope.$broadcast('show-errors-check-validity');

                if (!$scope.signupForm.$valid) {
                    return; 
                }
                else if ($scope.signupForm.$valid) {
                    MainService.setCurrentUser(user);
                    $location.path('/user/create');
                }
            }

		}

})();