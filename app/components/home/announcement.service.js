angular
    .module('awt-cts-client')
    .service('announcementService', announcementService);

announcementService.$inject = ['$http', 'CONFIG', '$log'];

function announcementService($http, CONFIG, $log) {
    var service = {
        getAnnouncements: getAnnouncements,
        getAnnouncementById: getAnnouncementById,
        addAnnouncement: addAnnouncement,
        getSimilarRealEstates: getSimilarRealEstates,
        getRealEstateImage: getRealEstateImage,
        getAnnouncementsByAuthor: getAnnouncementsByAuthor,
        extendExpirationDate: extendExpirationDate,
        searchAnnouncements: searchAnnouncements
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


    /**
     * Retrieves all announcemnts by specified Author ID.
     *
     * @param {integer} authorId    ID of the announcements author
     * @returns response
     */
    function getAnnouncementsByAuthor(authorId) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/user/' + authorId + '?page=0')
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                $log.warn("Unable to retrieve announcements for provided userId.");
                return response;
            });
    };

    /**
     * Extends announcement Expiration Date to provided value.
     *
     * @param {any} annId           ID of the announcement
     * @param {any} expirationMap   Map containging pair expirationDate:dateValue -> format dd/MM/yyyy
     * @returns response
     */
    function extendExpirationDate(annId, expirationMap) {
        return $http.put(CONFIG.SERVICE_URL + '/announcements/' + annId, expirationMap)
            .then(function successCallback(response){
                $log.info("Expiration date extended to " + expirationMap['expirationDate'] + "!");
                return response;
            }, function errorCallback(response) {
                $log.warn("Operation unsuccessful beacuse of: " + response.headers('X-SCT-ALERT'));
                throw response.headers('X-SCT-ALERT');
            });
    };

    /**
     * Search announcements by defined search parameters.
     *
     * @param {string} searchTerm   HTTP format of parameters for search -> key1=value1&key2=value2 ...
     * @returns list of found announcements
     */
    function searchAnnouncements(searchTerm) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/search?' + searchTerm)
            .then(function onSuccess(response) {
                return response;
            },
            function onError(response) {
                return response;
            });
    };
}