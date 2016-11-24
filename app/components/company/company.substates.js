(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('company.members', {
                url: "/members?page&sort&search",
                data: {
                    pageTitle: 'Podaci o agenciji'
                },
                views: {
                    'companyMembers': {
                        templateUrl: "app/components/company/company-members.html",
                        controller: "CompanyMembersController",
                        controllerAs: "vm"
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
                    pagingParams: ['$stateParams', 'Pagination', function($stateParams, Pagination) {
                        return {
                            page: Pagination.parsePage($stateParams.page),
                            sort: $stateParams.sort,
                            predicate: Pagination.parsePredicate($stateParams.sort),
                            ascending: Pagination.parseAscending($stateParams.sort),
                            search: $stateParams.search
                        };
                    }],
                }
            })
            .state('company.announcements', {
                url: "/announcements?page&sort&search",
                data: {
                    pageTitle: 'Podaci o agenciji'
                },
                views: {
                    'companyAnnouncements': {
                        templateUrl: "app/components/company/company-announcements.html",
                        controller: "CompanyAnnouncementsController",
                        controllerAs: "vm"
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
                    pagingParams: ['$stateParams', 'Pagination', function($stateParams, Pagination) {
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
