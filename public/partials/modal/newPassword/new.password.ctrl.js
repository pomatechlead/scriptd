(function(){
    "use strict";
    angular
        .module("scriptd")
        .controller("NewPasswordModalCtrl", newPasswordModalCtrl);
        function newPasswordModalCtrl(UserService, $state){
        	var vm = this;

            vm.pass= {}

        	// FUNCTIONS
            vm.goEdit = goEdit;
            vm.newPassword = newPassword;

        	//////////////////////////////////////

            function goEdit(){
                window.history.back()
            }

            function newPassword(pass){
                UserService.changePass(pass)
                    .then(function(data){
                        console.log('Change Password');
                        $state.go('editUserPage.modal.resetPassed');
                    })
            }



		}

})();