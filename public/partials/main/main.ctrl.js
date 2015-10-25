(function(){
    "use strict";
    angular
        .module("scriptd")
        .controller("MainCtrl", mainCtrl);
        function mainCtrl($location){
            var vm = this;

            //Values

            //Show Hides

            //Functions
            vm.navClass = navClass;


            ///////////////////////////////////////////////


            function navClass (page) {
                var currentRoute = $location.path().substring(1) || 'main';
                return page === currentRoute ? 'active' : '';
            };



        }

})();
