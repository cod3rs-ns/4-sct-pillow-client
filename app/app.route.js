angular
    .module('awt-cts-client', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
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
        })
        .state('login', {
          url: "/login",
          templateUrl: "app/components/signing/signing.html",
          controller: "SigningController",
          controllerAs: "signingVm"
        });

        $httpProvider.interceptors.push(['$q', '$window', '$location', function($q, $window, $location) {
          return {
              // Set Header to Request if user is logged
              'request': function (config) {
                  var token = $window.localStorage.getItem('AUTH_TOKEN');
                  if (token != "null") {
                    config.headers['X-Auth-Token'] = token;
                  }
                  return config;
              },
              // When try to get Unauthorized page
              'responseError': function(response) {
                  if(response.status === 401 || response.status === 403) {
                    $location.path('/');
                  }
                  return $q.reject(response);
                }
            };
          }]);
    });
