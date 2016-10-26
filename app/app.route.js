angular
    .module('awt-cts-client', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
      // For any unmatched url, redirect to /home
      $urlRouterProvider.otherwise("/home");

      // States setup
      $stateProvider
        .state('home', {
          url: "/home",
          templateUrl: "app/components/home/home.html",
          controller: "HomeController",
          controllerAs: "homeVm"
        })
        .state('about', {
          url: "/about",
          templateUrl: "app/components/about/about.html",
          controller: "AboutController",
          controllerAs: "aboutVm"
        });
    });
