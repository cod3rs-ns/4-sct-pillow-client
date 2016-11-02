(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('RealEstateController', RealEstateController);

    RealEstateController.$inject = ['$scope', '$state', '$http', 'RealEstateService', 'LinkParser', 'pagingParams', 'paginationConstants'];

    function RealEstateController ($scope, $state, $http, RealEstateService, LinkParser, pagingParams, paginationConstants) {
        var vm = this;
        
        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.clear = clear;
        vm.activate = activate;

        activate();

        function activate () {
            RealEstateService.query({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                sort: sort()
            }, onSuccess, onError);
            
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
                vm.realEstates = data;
                vm.page = pagingParams.page;
            }
            function onError(error) {
                console.log('Error in activating RealEstateController!');
            }
        }

        function loadPage (page) {
            vm.page = page;
            vm.transition();
        }

        function transition () {
            $state.transitionTo($state.$current, {
                page: vm.page,
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc'),
            });
        }

        function clear () {
            vm.links = null;
            vm.page = 1;
            vm.predicate = 'id';
            vm.reverse = true;
            vm.currentSearch = null;
            vm.transition();
        }
    }
})();
