(function(){
    "use strict";
    angular
        .module("scriptd")
        .controller("SharedCtrl", sharedCtrl);
    
    function sharedCtrl($location, UserService, $scope, $state, $window){
        var vm = this;

        //Values
        vm.currentUser = {};

        //Show Hides
        vm.logged = true;
        vm.notLog = false;
        vm.uploadBtn = true;
        vm.editBtn = false;
        vm.userOptions = false;
        vm.profileFollow = true;
        vm.profileUpload = false;

        //Routes
        vm.goHome = goHome;

        // Functions      
        vm.loginModal = loginModal;
        vm.requireLogin = requireLogin;  
        vm.showOptions = showOptions;
        vm.goUserProfile = goUserProfile;
        vm.editUser = editUser;
        vm.findUser = findUser;
        vm.uploadScriptMain = uploadScriptMain;
        vm.uploadScriptProfile = uploadScriptProfile;
        vm.closeModal = closeModal;

        /////////////////////////////////////////////////////////////////////

        // Routes
        function goHome(){$state.go('mainPage.home');};
        function uploadScriptMain(){$state.go('mainPage.home.modal.upload');}
        function uploadScriptProfile(){$state.go('mainPage.profile.modal.upload');}
        function goUserProfile () {$location.path('/main/profile/' + vm.currentUser._id);};
        function loginModal () {$location.path("/main/modal/login");};
        function editUser(){$location.path('/user/edit/' + vm.currentUser._id);};
        function findUser(idAuthor){$location.path('/main/profile/' + idAuthor);};
        // Go to parent view
        function closeModal() {
            var state = $state.current.name;
            if(state.indexOf('home') > -1 || state.indexOf('createUserPage') > -1 || state.indexOf('uploadPage') > -1 || state.indexOf('socialUserPage') > -1){
                $state.go('mainPage.home');
            }
            if(state.indexOf('profile') > -1 || state.indexOf('editUserPage') > -1){
                $state.go('mainPage.profile');
            }
        }

        //Show Hide
        function showOptions(){vm.userOptions = !vm.userOptions;}


        $scope.$on("$stateChangeSuccess", function () {
            requireLogin();
            if ($state.includes('mainPage.profile')){
                if($state.params.user === vm.currentUser._id){
                    vm.profileUpload = true;
                    vm.profileFollow = false;
                    vm.editBtn = true;
                    vm.uploadBtn = false;
                } else {
                    vm.uploadBtn = true;
                    vm.editBtn = false;
                    vm.profileFollow = true;
                    vm.profileUpload = false;
                }
            } else {
                vm.uploadBtn = true;
                vm.editBtn = false;
            }
        })
        

        function requireLogin () {
            UserService.requireLogin()
                .then(function(data){
                    if(data !== null && typeof data === 'object'){
                        vm.currentUser = data;
                        vm.logged = true;
                        vm.notLog = false;
                    } else {
                        vm.logged = false;
                        vm.notLog = true;
                    }
                });
        }
        requireLogin(); 


        // FAVORITING SCRIPTS 



    }

})();