"use strict"

angular
    .module('app', ['application', 'ngMaterial', 'ui.router'])
    
    .config(function($provide, $locationProvider, $urlRouterProvider, $stateProvider, $httpProvider){
        
        // Gets rid of hash in single page app.
        $locationProvider.html5Mode(true).hashPrefix('*');

        // Setup Routing
        
        // Default routing to home page
        $urlRouterProvider.otherwise('/home');                        
        
        $stateProvider            
            .state('home', {
                url: '/home',
                templateUrl: 'components/home/home.tpl.html'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'components/users/users.tpl.html'
            })            
            .state('details', {
                url: '/users/details/:id',
                templateUrl: 'components/users/details/details.tpl.html'
            })
            .state('edit', {
                url: '/users/edit/:id',
                templateUrl: 'components/users/edit.tpl.html'
            })
            .state('add', {
                url: '/users/add/',
                templateUrl: 'components/users/add.tpl.html'
            })
            .state('login', {
                url: '/users/login/',
                templateUrl: 'components/users/login.tpl.html'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'components/profile/profile.tpl.html',
                controller: 'profileController as user'
            });                                
    });