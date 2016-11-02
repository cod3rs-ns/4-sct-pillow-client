(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('real-estates', {
            url: '/real-estate?page&sort&search',
            data: {
                pageTitle: 'RealEstates'
            },
            views: {
                'content@': {
                    templateUrl: 'app/components/real-estate/real-estates.html',
                    controller: 'RealEstateController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'Pagination', function ($stateParams, Pagination) {
                    return {
                        page: Pagination.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: Pagination.parsePredicate($stateParams.sort),
                        ascending: Pagination.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
            }
        });
    }

})();
