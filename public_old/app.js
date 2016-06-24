var myApp = angular.module('myApp',['ngRoute'])
.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'LoginController',
			templateUrl: 'views/home.html'
		})
		.when('/users', {
			controller: 'UsersController',
			templateUrl: 'views/users.html'
		})
		.when('/users/details/:id', {
			controller: 'UsersDetailsController',
			templateUrl: 'views/user_details.html'
		})
		.when('/users/edit/:id', {
			controller: 'EditUserController',
			templateUrl: 'views/edit_user.html'
		})
		.when('/users/add', {
			controller: 'AddUserController',
			templateUrl: 'views/add_user.html'
		})
		.when('/users/login', {
			controller: 'LoginController',
			templateUrl: 'views/login.html'
		})
		
		.otherwise({
			redirectTo: '/'
		});
})
