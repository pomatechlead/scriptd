(function(){
    "use strict";
    angular
        .module("scriptd")
        .controller("ResetModalCtrl", resetModalCtrl);
        function resetModalCtrl(UserService, $location, $stateParams, $scope){
        	var vm = this;

        	// FUNCTIONS
        	vm.newPass = newPass;

        	//////////////////////////////////////

        	function newPass(password) {
                console.log(password);
                console.log($stateParams.token);
                $scope.$broadcast('show-errors-check-validity');

                if (!$scope.newPassForm.$valid) {
                    return; 
                }
                else if ($scope.newPassForm.$valid) {
                    UserService.resetPass(password, $stateParams.token)
                    .then(function(){
                        $location.path('/main/modal/reset-passed');
                    });
                }
        	}


		}

})();