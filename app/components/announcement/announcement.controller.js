angular
    .module('awt-cts-client')
    .controller('AnnouncementController', AnnouncementController);

AnnouncementController.$inject = ['$stateParams', 'announcementService'];

function AnnouncementController($stateParams, announcementService) {
    var announcementVm = this;

    announcementVm.announcement = {};

    announcementVm.getAnnouncement = getAnnouncement;

    activate();

    function activate () {
        announcementVm.getAnnouncement($stateParams.announcementId);
    }

    function getAnnouncement(announcementId) {
        announcementService.getAnnouncementById(announcementId)
            .then(function(response) {
                announcementVm.announcement = response.data;
            });
    }
}