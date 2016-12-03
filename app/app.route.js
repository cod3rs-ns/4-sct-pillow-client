angular
    .module('awt-cts-client', ['ui.router', 'ngResource', 'ngAnimate','ngSanitize', 'ui.bootstrap', 'angularFileUpload'])
    .constant(
        'CONFIG', {
            'SERVICE_URL': 'http://localhost:8091/api',
            'AUTH_TOKEN': 'X-Auth-Token'
        }
    )
    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
      // For any unmatched url, redirect to /home
      $urlRouterProvider.otherwise("/home");

      // States setup
      $stateProvider
        .state('home', {
          url: "/home",
          data: {
                pageTitle: 'Početna'
            },
            views: {
                'content@': {
                    templateUrl: "app/components/home/home.html",
                    controller: "HomeController",
                    controllerAs: "homeVm"
                }
            }
        })
        .state('about', {
          url: "/about",
          data: {
                pageTitle: 'Početna'
            },
            views: {
                'content@': {
                    templateUrl: "app/components/about/about.html",
                    controller: "AboutController",
                    controllerAs: "aboutVm"
                }
            }
        })
        .state('announcement', {
          url: "/announcement/:announcementId",
          data: {
                pageTitle: 'Podaci o oglasu'
            },
            views: {
                'content@': {
                    templateUrl: "app/components/announcement/announcement.html",
                    controller: "AnnouncementController",
                    controllerAs: "announcementVm"
                }
            }
        })
        .state('addAnnouncement', {
          url: "/addAnnouncement",
          data: {
                pageTitle: 'Dodavanje oglasa'
            },
            views: {
                'content@': {
                    templateUrl: "app/components/announcement/announcement-form.html",
                    controller: "AnnouncementFormController",
                    controllerAs: "announcementFormVm"
                }
            }
        })
        .state('company', {
          url: "/company/:companyId",
          data: {
                pageTitle: 'Podaci o oglasu'
            },
            views: {
                'content@': {
                    templateUrl: "app/components/company/company.html",
                    controller: "CompanyController",
                    controllerAs: "companyVm"
                }
            }
        })
        .state('addCompany', {
          url: "/addCompany",
          data: {
                pageTitle: 'Dodavanje agencije'
            },
            views: {
                'content@': {
                    templateUrl: "app/components/company/company-form.html",
                    controller: "CompanyFormController",
                    controllerAs: "companyFormVm"
                }
            }
        })
        .state('profile', {
          url: "/profile",
          data: {
              pageTitle: 'Profil korisnika'
            },
            views: {
                'content@': {
                    templateUrl: "app/components/user-profile/user-profile.html",
                    controller: "UserProfileController",
                    controllerAs: "userVm"
                }
            }
        })
        .state('login', {
          url: "/login",
          data: {
                pageTitle: 'Početna'
            },
            views: {
                'content@': {
                    templateUrl: "app/components/signing/signing.html",
                    controller: "SigningController",
                    controllerAs: "signingVm"
                }
            }
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
                    console.log('a');
                    $location.path('/');
                  }
                  return $q.reject(response);
                }
            };
          }]);
    });
