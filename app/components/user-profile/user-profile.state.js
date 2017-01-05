(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('profile', {
            url: '/profile/:username/?page&sort',
            data: {
                pageTitle: 'Profile korisnika'
            },
            views: {
                'content@': {
                    templateUrl: "app/components/user-profile/user-profile.html",
                    controller: "UserProfileController",
                    controllerAs: "userVm"
                }
            },
            params: {
                page: {
                    value: '1'
                },
                sort: {
                    value: 'id,asc'
                }
            },
            resolve: {
                pagingParams: ['$stateParams', 'Pagination', function ($stateParams, Pagination) {
                    return {
                        page: Pagination.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: Pagination.parsePredicate($stateParams.sort),
                        ascending: Pagination.parseAscending($stateParams.sort)
                    };
                }],
            }
        });
    }

})();
