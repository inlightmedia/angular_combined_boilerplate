myApp.controller('UserDetailsController', ['$scope', '$http', '$location', '$routeParams', '$rootScope', function($scope, $http, $location, $routeParams, $rootScope){

	$scope.getUserbyId = function () {
		var id = $routeParams.id;
		$http.get('/api/users/' + id).success(function (response) {
			$scope.user = response;
		});
	}

	$scope.setTitle = function (title) {
		$rootScope.pageTitle = title;
	}
}]);