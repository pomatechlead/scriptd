(function() {
	'use strict';

	angular
		.module('scriptd')
		.service("MainService" , mainService);

	function mainService($stateParams, $http, $q){

		this.setCurrentResult = setCurrentResult;
		this.getCurrentResult = getCurrentResult;

		this.setCurrentUser = setCurrentUser;
		this.getCurrentUser = getCurrentUser;

		var currentResult;
		var currentUser;

    	////////////

		function setCurrentResult(result){
			console.log(result);
			currentResult = result;
		}
		function getCurrentResult(){
			var deferred = $q.defer();
			// if(!currentResult){
				$http.get("/scripts/" + $stateParams.result)
					.then(function(data){
						console.log(data);
						deferred.resolve(data.data);
					}, function(error){
						deferred.reject(error);
					})
			// }
			return deferred.promise;
		}

		function setCurrentUser(user){
			currentUser = user;
		}

		function getCurrentUser(){
			return currentUser;
		}


	}

})();