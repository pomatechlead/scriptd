(function(){
    "use strict";
    angular
        .module("scriptd")
        .controller("HomeCtrl", homeCtrl);
        function homeCtrl($state, ScriptService, MainService, UserService){
            var vm = this;

            //Values
            vm.showMainScripts = [];

            //Show Hide


            //Functions
            vm.fetchMainScripts = fetchMainScripts;
            vm.addFavorite = addFavorite;
            vm.removeFavorite = removeFavorite;
            vm.checkOutScript = checkOutScript;

            ///////////////////////////////////////////////

            function fetchMainScripts() {
                // GET SCRIPTS
            	ScriptService.fetchMainScripts()
            		.then(function(data){
                        //SET THE DATA FOR THE VIEW
            			vm.showMainScripts = data;
                        //GET USER DATA
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

                                    for(var i = 0; i < vm.showMainScripts.length; i++){
                                        if(userFavs.indexOf(vm.showMainScripts[i]._id) > -1){
                                            vm.showMainScripts[i].favMatch = true;
                                        } else {vm.showMainScripts[i].favMatch = false;}
                                    }
                                }
                            });
            		})
            }

            function addFavorite(id) {
            	ScriptService.favoriteMainScript(id)
                    .then(function(){
                        fetchMainScripts();
                    });
            }

            function removeFavorite(id) {
                ScriptService.removefavoriteMainScript(id)
                    .then(function(){
                        fetchMainScripts();
                    });
            }


            function checkOutScript(result){
                MainService.setCurrentResult(result);
                $state.go('mainPage.home.modal.script', {result: result._id});
            }


            //Run at App Start
            fetchMainScripts();


        }

})();






