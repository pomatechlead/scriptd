(function(){
    "use strict";
    angular
        .module("scriptd")
        .controller("LoginModalCtrl", loginModalCtrl);
        function loginModalCtrl(UserService, $scope, $location, $state){
        	var vm = this;

            // ROUTES
            vm.forgot = forgot;

        	// FUNCTIONS
        	vm.login = login

        	//////////////////////////////////////

            //Routes

            function forgot(){
                $location.path('/main/modal/forgot');
            }

            //Functions

        	function login(user){
                $scope.$broadcast('show-errors-check-validity');

                if (!$scope.loginForm.$valid) {
                    return; 
                }
                else if ($scope.loginForm.$valid) {
                    return UserService.login(user.username, user.password)
                        .then(function(){
                            console.log('You have logged in!');
                            //redirect them to status page
                            // $scope.loginError = false;
                            $state.go('mainPage.home');
                        }, function(error){
                            console.log('Failed Login');
                        })
                }
               
        	}

		}

})();