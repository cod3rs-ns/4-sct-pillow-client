(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('AnnouncementController', AnnouncementController);

    AnnouncementController.$inject = ['$stateParams', '$log', 'announcementService', '_'];

    function AnnouncementController($stateParams, $log, announcementService, _) {
        var announcementVm = this;

        announcementVm.announcement = {};
        announcementVm.images = [];
        announcementVm.address = null;

        announcementVm.getAnnouncement = getAnnouncement;
        announcementVm.initMap = initMap;

        activate();

        function activate () {
            announcementVm.getAnnouncement($stateParams.announcementId);
        }

        function getAnnouncement(announcementId) {
            announcementService.getAnnouncementById(announcementId)
                .then(function(response) {
                    announcementVm.announcement = response.data;
                    announcementVm.address = response.data.realEstate.location;

                    _.forEach(response.data.images, function(image, index) {
                        announcementVm.images.push({'id': index, 'image': image.imagePath});
                    });
                });
        }

        function initMap() {
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16
            });

            var geocoder = new google.maps.Geocoder();
            geocodeAddress(geocoder, map);
        }

        function geocodeAddress(geocoder, resultsMap) {
            var address = announcementVm.address.city + ' ' + announcementVm.address.street + ' ' +
              + announcementVm.address.streetNumber + ' ' + announcementVm.address.country;

            geocoder.geocode({'address': address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                resultsMap.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });
                } else {
                    $log.error('Geocode was not successful for the following reason: ' + status);
                }
            });
        }

    }
})();