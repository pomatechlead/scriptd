(function(){
    "use strict";
    angular
        .module("scriptd")
        .controller("ProfileCtrl", profileCtrl);
        function profileCtrl($location, UserService, $state, ScriptService, MainService){
            var vm = this;

            //Values
            vm.profileData = {};
            vm.profileScripts = [];

            //Show Hide
            vm.favoritedStar = true;


            //Functions
            vm.getProfileData = getProfileData;
            vm.addFavorite = addFavorite;
            vm.removeFavorite = removeFavorite;
            vm.checkOutScript = checkOutScript;


            ///////////////////////////////////////////////

            function checkOutScript(result){
                MainService.setCurrentResult(result);
                $state.go('mainPage.profile.modal.script', {result: result._id});
            }

            function getProfileData(){
                UserService.getUser($state.params.user)
                    .then(function(data){
                        vm.profileData = data;
                        var userScripts = vm.profileData.uploads;
                        vm.profileScripts = [];
                        for(var i = 0; i < userScripts.length; i++){
                            ScriptService.fetchScript(userScripts[i].script)
                                .then(function(data){
                                    vm.profileScripts.push(data);
                                    UserService.requireLogin()
                                        .then(function(user){
                                            // If user is logged in
                                            if(typeof user === 'object'){
                                                var fav = user.favorites;
                                                var userFavs = []
                                                // LOOP THROUGH FAVORITES ID's
                                                for(var j = 0; j < fav.length; j++){
                                                    userFavs.push(fav[j].script)
                                                }

                                                for(var i = 0; i < vm.profileScripts.length; i++){
                                                    if(userFavs.indexOf(vm.profileScripts[i]._id) > -1){
                                                        vm.profileScripts[i].favMatch = true;
                                                    } else {vm.profileScripts[i].favMatch = false;}
                                                }
                                            }
                                        });
                                })
                        }
                    });
            }
            getProfileData();



            function addFavorite(id) {
                vm.favoritedStar = false;
                ScriptService.favoriteMainScript(id)
                    .then(function(){
                        getProfileData();
                    });
            }

            function removeFavorite(id) {
                vm.favoritedStar = true;
                ScriptService.removefavoriteMainScript(id)
                    .then(function(){
                        getProfileData();
                    });
            }



        }

})();






