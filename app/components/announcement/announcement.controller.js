angular
    .module('awt-cts-client')
    .controller('AnnouncementController', AnnouncementController);

AnnouncementController.$inject = ['$stateParams', 'announcementService'];

function AnnouncementController($stateParams, announcementService) {
    var announcementVm = this;

    announcementVm.announcement = {};
    announcementVm.images = [];
    announcementVm.address = "90 Bedford Street, Greenwich Village";

    announcementVm.getAnnouncement = getAnnouncement;
    announcementVm.initMap = initMap;

    activate();

    function activate () {
        announcementVm.getAnnouncement($stateParams.announcementId);

        announcementVm.images.push({'id': 0, 'image': 'http://i.telegraph.co.uk/multimedia/archive/01727/penthouse6_1727874i.jpg'});
        announcementVm.images.push({'id': 1, 'image': 'http://i.telegraph.co.uk/multimedia/archive/01727/penthouse2_2_1727857i.jpg'});
        announcementVm.images.push({'id': 2, 'image': 'http://i.telegraph.co.uk/multimedia/archive/01727/penthouse8_2_1727884i.jpg'});
        announcementVm.images.push({'id': 3, 'image': 'http://i.telegraph.co.uk/multimedia/archive/01727/penthouse2_1727854i.jpg'});
    }

    function getAnnouncement(announcementId) {
        announcementService.getAnnouncementById(announcementId)
            .then(function(response) {
                announcementVm.announcement = response.data;
            });
    }

    function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: {lat: -34.397, lng: 150.644}
        });

        var geocoder = new google.maps.Geocoder();
        geocodeAddress(geocoder, map);
    }

    function geocodeAddress(geocoder, resultsMap) {
        var address = announcementVm.address;

        geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

}