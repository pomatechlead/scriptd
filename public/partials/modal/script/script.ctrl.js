(function() {
  "use strict";
  angular
    .module("scriptd")
    .controller("ScriptModalCtrl", scriptModalCtrl);

    function scriptModalCtrl(MainService, ScriptService, $scope, $stateParams, UserService) {
        var vm = this;

        vm.currentResult = {};

        //Show Hide

        //Functions
        vm.addFavorite = addFavorite;
        vm.removeFavorite = removeFavorite;
        
        
        ///////////////////////////////////
        
        
        function addFavorite(id) {
            ScriptService.favoriteMainScript(id)
            .then(function() {
                getCurrentResult();
            }); 
        }
        
        function removeFavorite(id) {
            ScriptService.removefavoriteMainScript(id)
            .then(function() {
                getCurrentResult();
            });
        }
        
        
        getCurrentResult();
        
        function getCurrentResult() {
           MainService.getCurrentResult()
           .then(function(result) {
               vm.currentResult = result;
                UserService.requireLogin()
                    .then(function(user){
                        var fav = user.favorites;
                        var userFavs = []
                        // LOOP THROUGH FAVORITES ID's
                        for(var j = 0; j < fav.length; j++){
                            userFavs.push(fav[j].script)
                        }

                        if(userFavs.indexOf(vm.currentResult._id) > -1){
                            vm.currentResult.favMatch = true;
                        } else {vm.currentResult.favMatch = false;}
                    });
           }, function(error) {
               console.log(error);
           })
        }


         $scope.scroll = 0;
         $scope.pdfUrl = '/getSample/' +$stateParams.result;
         $scope.getNavStyle = function(scroll) {
             if(scroll > 100) return 'pdf-controls fixed';
             else return 'pdf-controls';
         }

        // ERROR
        // https://github.com/sayanee/angularjs-pdf/issues/21

  }

})();
