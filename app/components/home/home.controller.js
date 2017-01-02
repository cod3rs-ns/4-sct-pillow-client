(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$state', '$log', '_', 'announcementService'];

    function HomeController($state, $log, _, announcementService) {
        var homeVm = this;

        homeVm.announcements = {};

        // Pagination init params
        homeVm.page = 0;
        homeVm.itemsPerPage = 10;
        homeVm.sortBy = 'id,desc';

        homeVm.getAllAnnouncements = getAllAnnouncements;
        homeVm.find = find;

        activate();

        function activate () {
          homeVm.getAllAnnouncements();
        }

        function getAllAnnouncements() {
            announcementService.getAnnouncements(homeVm.page, homeVm.itemsPerPage, homeVm.sortBy)
                .then(function(response) {
                    $log.log(response);
                    homeVm.announcements = response.data;
                    homeVm.totalItems = response.headers('X-Total-Count');
                });
        }

        function find() {
            var searchTerm = "";

            _.forEach(homeVm.search, function(value, key) {
                if (value !== '' && value !== undefined) {
                    searchTerm += key + "=" + value + "&";
                }
            });

            $log.warn(searchTerm);
            announcementService.searchAnnouncements(searchTerm)
                .then(function(response) {
                    homeVm.announcements = response.data;
                });
        }
    }
})();