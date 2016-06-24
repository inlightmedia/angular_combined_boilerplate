myApp.controller('AddUserController', ['$scope', '$http', '$location', '$routeParams', '$rootScope', function($scope, $http, $location, $routeParams, $rootScope){

	$scope.setTitle = function (title) {
		$rootScope.pageTitle = title;
	}

	$scope.addUser = function () {
		$http.post('/api/users/', $scope.user).success(function (response) {
			window.location.href='/#users';
			console.log('User Added!');
			alert('User Added!');
		});
	}

}]);
