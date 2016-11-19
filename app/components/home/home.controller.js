angular
    .module('awt-cts-client')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$state', 'announcementService'];

function HomeController($state, announcementService) {
    var homeVm = this;

    // Pagination init params
    homeVm.page = 0;
    homeVm.itemsPerPage = 10;
    homeVm.sortBy = 'id,desc';

    homeVm.getAllAnnouncements = getAllAnnouncements;
    homeVm.announcements = {};

    activate();

    function activate () {
      homeVm.getAllAnnouncements();
    }

    function getAllAnnouncements() {
        announcementService.getAnnouncements(homeVm.page, homeVm.itemsPerPage, homeVm.sortBy)
            .then(function(response) {
                console.log(response);
                homeVm.announcements = response.data;
                homeVm.totalItems = response.headers('X-Total-Count');
            });
    }
}
