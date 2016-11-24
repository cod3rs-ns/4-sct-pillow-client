(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('CompanyMembersController', CompanyMembersController);

    CompanyMembersController.$inject = ['$scope', '$state', '$stateParams', '$http', 'companyService', 'LinkParser', 'pagingParams', 'paginationConstants'];

    function CompanyMembersController ($scope, $state, $stateParams, $http, companyService, LinkParser, pagingParams, paginationConstants) {
        var vm = this;
        
        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.usersPerPage;
        vm.clear = clear;
        vm.activate = activate;

        activate();

        function activate () {
            companyService.getUsersByCompanyId($stateParams.companyId, pagingParams.page - 1, vm.itemsPerPage, sort(),
                onSuccess, onError);

            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }
            function onSuccess(data, headers) {
                vm.links = LinkParser.parse(headers('Link'));
                vm.totalItems = headers('X-Total-Count');
                vm.queryCount = vm.totalItems;
                vm.users = data;
                vm.page = pagingParams.page;
                companyService.setUserPage(vm.page);
            }
            function onError(error) {
                console.log('Error in activating comppany members!');
            }
        }

        function loadPage (page) {
            companyService.setUserPage(page);
            vm.page = page;
            vm.transition();
        }

        function transition () {
            $state.transitionTo($state.$current, {
                companyId: $stateParams.companyId,
                page: vm.page,
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc'),
            });
        }

        function clear () {
            vm.links = null;
            companyService.setUserPage(1);
            vm.page = 1;
            vm.predicate = 'id';
            vm.reverse = true;
            vm.currentSearch = null;
            vm.transition();
        }
    }
})();
