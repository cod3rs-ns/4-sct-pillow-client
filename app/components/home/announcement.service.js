angular
    .module('awt-cts-client')
    .service('announcementService', announcementService);

announcementService.$inject = ['$http', 'CONFIG'];

function announcementService($http, CONFIG) {
    var service = {
        getAnnouncements: getAnnouncements,
        getAnnouncementById: getAnnouncementById,
        addAnnouncement: addAnnouncement,
        getSimilarRealEstates: getSimilarRealEstates,
        getRealEstateImage: getRealEstateImage
    };

    return service;

    function getAnnouncements(page, size, sort) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/deleted/false?page=' + page + '&size=' + size + '&sort=' + sort)
            .then(function (response) {
                return response;
            });
    };

    function getAnnouncementById(id) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/' + id)
            .then(function (response) {
                return response;
            });
    };


    function addAnnouncement(announcement) {
        return $http.post(CONFIG.SERVICE_URL + '/announcements', announcement)
            .then(function (response) {
                return response;
            });
    };

    function getSimilarRealEstates(realEstate) {
        return $http.get(CONFIG.SERVICE_URL + '/real-estates/similar',
            {
                params: {
                    area: realEstate.area,
                    country: realEstate.location.country,
                    city: realEstate.location.city,
                    region: realEstate.location.cityRegion,
                    street: realEstate.location.street,
                    number: realEstate.location.streetNumber
                }
            })
            .then(function (response) {
                return response;
            });
    };

    function getRealEstateImage(id) {
        return $http.get(CONFIG.SERVICE_URL + '/real-estates/' + id + '/image')
            .then(function (response) {
                return response;
            });
    };
}