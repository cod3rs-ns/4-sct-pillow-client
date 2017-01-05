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
        getAnnouncementsByAuthorAndStatus: getAnnouncementsByAuthorAndStatus,
        getAnnouncementsInArea: getAnnouncementsInArea,
        extendExpirationDate: extendExpirationDate,
        searchAnnouncements: searchAnnouncements,
        alreadyReported: alreadyReported,
        updateAnnouncement: updateAnnouncement
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
     * Retrieves all announcemnts by specified Author ID and announcemnt's status - is deleted.
     *
     * @param {integer} authorId    ID of the announcements author
     * @param {boolean} deleted     announcement's status - is deleted
     * @param {integer} page        page to retrieve from repository
     * @param {integer} size        page size
     * @param {string}  sort        sort attributes
     * @returns response
     */
    
    function getAnnouncementsByAuthorAndStatus(authorId, deleted, page, size, sort) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/user/' + authorId + '/' + deleted + '?page=' + page + '&size=' + size + '&sort=' + sort)
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                $log.warn("Unable to retrieve announcements for provided userId.");
                return response;
            });
    };

    /**
     * Retrieves all announcemnets that are in provided area
     *
     * @param {object} northEast     North East longitude and latitude
     * @param {object} southWest     South West longitude and latitude
     * @returns response
     */
    function getAnnouncementsInArea(northEast, southWest) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/location-search?topRightLat='
          + northEast.lat() + '&topRightLong=' + northEast.lng() + '&bottomLeftLat=' + southWest.lat() + '&bottomLeftLong=' + southWest.lng())
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                $log.warn("Unable to retrieve announcements for provided area.");
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
            .then(function successCallback(response) {
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

    /**
     * Check if user already reported announcement.
     *
     * @param {any} annId   ID of the announcement
     * @param {any} email   email of the reporter
     * @returns response
     */
    function alreadyReported(annId, username) {
        return $http.get(CONFIG.SERVICE_URL + '/reports/exists', {
            params: {
                "username": username,
                "id": annId
            }
        })
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                $log.warn("Operation unsuccessful");
            });
    };


    /**
     * Update one announcement.
     *
     * @param {any} announcemnt   announcement that will be updated
     * @returns response
     */
    function updateAnnouncement(announcement) {
        return $http.put(CONFIG.SERVICE_URL + '/announcements', announcement)
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                $log.warn("Updating announcemnt unsuccessful");
            });
    }
}