myApp.controller('EditUserController', ['$scope', '$http', '$location', '$routeParams', '$rootScope', function($scope, $http, $location, $routeParams, $rootScope){

	// Sets title in index.html main header-title bar
	$scope.setTitle = function (title) {
		$rootScope.pageTitle = title;
	}

	// Updates User Information in Database by Communicating with /routes/users.js PUT route
	$scope.editUser = function (id) {
		$http.put('/api/users/' + id, $scope.user).success(function (response) {
			window.location.href='/#users';
			console.log('User Updated!');
			alert('User Updated!');
		});
	}

	// Gets user data for the user that called the function receiving the UserId
	$scope.getUserbyId = function () {
		var id = $routeParams.id;
		$http.get('/api/users/' + id).success(function (response) {
			$scope.user = response;
			console.log('User received from database: ' + $scope.user);
		});
	}
}]);