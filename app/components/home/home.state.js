(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
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