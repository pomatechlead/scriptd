(function(){
    "use strict";
    angular
        .module("scriptd")
        .controller("ForgotModalCtrl", forgotModalCtrl);
        function forgotModalCtrl(UserService, $location){
        	var vm = this;

        	// FUNCTIONS
        	vm.forgot = forgot;

        	//////////////////////////////////////

        	function forgot(email){
        		UserService.forgot(email)
        			.then(function(){
                        console.log('Reset Sent');
                        //redirect them to status page
                        // $scope.loginError = false;
                        $location.path('/main/modal/forgot-message');
                    })
    	}



		}

})();