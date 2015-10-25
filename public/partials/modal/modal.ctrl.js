(function(){
    "use strict";
    angular
        .module("scriptd")
        .controller("ModalCtrl", modalCtrl);
        function modalCtrl(ScriptService, $location){
        	var vm = this;



        	// FUNCTIONS
        	vm.takeMeToScript = takeMeToScript;


        	//////////////////////////////////////

        	function takeMeToScript() {
        		ScriptService.fetchScriptID()
        		.then(function(data){
        			$location.path("main/modal/script/" + data);
        		})
        	}


		}

})();