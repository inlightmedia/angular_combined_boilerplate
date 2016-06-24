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