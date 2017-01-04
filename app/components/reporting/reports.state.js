(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('reports', {
            url: '/reports?page&sort',
            data: {
                pageTitle: 'Prijave'
            },
            views: {
                'content@': {
                    templateUrl: 'app/components/reporting/reports.html',
                    controller: 'ReportsController',
                    controllerAs: 'reportVm'
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
