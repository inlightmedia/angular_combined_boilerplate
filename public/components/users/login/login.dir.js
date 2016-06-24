myApp.controller('LoginController', ['$scope', '$http', '$location', '$routeParams', '$rootScope', function($scope, $http, $location, $routeParams, $rootScope){
	$scope.errorMessage = '';
	$scope.user = {};

	$rootScope.logout = function(){
		$http.get('/api/users/logout')
			.success(function() {
			   	console.log("Logout Successful");
			   	$rootScope.loggedUser = null;
		   	})
		   	.error(function() {
			   	console.log("Logout Failed");
				$scope.alert = 'Logout failed'
		   	});

		$rootScope.loggedUser = null;
		alert('You are logged out.');
	}

	$scope.login = function () {
		console.log($scope.user);
		$http.post('/api/users/login/', $scope.user).success(function (response, status) {
			$http.get('/api/users/username/' + $scope.user.username).success(function (response) {
				$rootScope.loggedUser = response;
			});
			window.location.href='/#/';
			console.log('You are logged in!');
			alert('Success: You are logged in!');
		})
		.error(function (err) {
			alert('Bad Cred, try again!');
			console.log('Error: either your name, password or both are incorrect.');
			$scope.errorMessage = 'Username/Password Invalid'
		});
	}

	$scope.setTitle = function (title) {
		$rootScope.pageTitle = title;
	}
}]);




