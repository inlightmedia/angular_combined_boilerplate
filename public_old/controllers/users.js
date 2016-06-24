// TODO Make setTitle a directive
// TODO See what else can be made into a directive and removed from controller
// TODO Remove unused code

var myApp = angular.module("myApp");

myApp.controller('UsersController', ['$scope', '$http', '$location', '$routeParams','$document', '$rootScope', function($scope, $http, $location, $routeParams, $document, $rootScope){
	$scope.getUsers = function () {
		$http.get('/api/users/').success(function (response) {
			$scope.users = response;
		});
	}
	$scope.getUserbyId = function () {
		var id = $routeParams.id;
		$http.get('/api/users/' + id).success(function (response) {
			$scope.user = response;
		});
	}

	$scope.setTitle = function (title) {
		$rootScope.pageTitle = title;
	}

	$scope.orderUsersBy = '';

	var i = 1;
	$scope.orderUsersByName = function () {
		i = i + 1;
		if (i%2 == 0) {
			$scope.orderUsersBy = 'displayName';
		} else {
			$scope.orderUsersBy = '-displayName';
		}
	}

	$scope.tobedeleted = '';
	$scope.deleteUser = function (user) {

			var shouldDelete = confirm('Are you sure you want to delete user: ' + (user.displayName ? user.displayName : user.id)  + '?');
			if (shouldDelete) {
				MotionUI.animateOut('.' + user.id, 'fade-out', function() {
					$http.delete('/api/users/' + user.id).success(function (response) {
						// window.location.href='/#users';
						$scope.getUsers();
						console.log('User Deleted!');
					});
				});

			} else {
				window.location.href='/#users';
			}
	}
}]);

// myApp.controller('UserDetailsController', ['$scope', '$http', '$location', '$routeParams', '$rootScope', function($scope, $http, $location, $routeParams, $rootScope){
//
// 	$scope.getUserbyId = function () {
// 		var id = $routeParams.id;
// 		$http.get('/api/users/' + id).success(function (response) {
// 			$scope.user = response;
// 		});
// 	}
//
// 	$scope.setTitle = function (title) {
// 		$rootScope.pageTitle = title;
// 	}
// }]);

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
