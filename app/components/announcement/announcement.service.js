angular
    .module('awt-cts-client')
    .service('announcementService', announcementService);

announcementService.$inject = ['$http', '$log', 'FileUploader', 'CONFIG'];

function announcementService($http, $log, FileUploader, CONFIG) {
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
        updateAnnouncement: updateAnnouncement,
        verifyAnnouncement: verifyAnnouncement,
        dummyImageUpload: dummyImageUpload
    };

    return service;

    function getAnnouncements(page, size, sort) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/deleted/false?page=' + page + '&size=' + size + '&sort=' + sort)
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                $log.warn(response.headers('X-SCT-Alert'));
                throw response.headers('X-SCT-Alert');
            });
    };

    function getAnnouncementById(id) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/' + id)
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                $log.warn(response.headers('X-SCT-Alert'));
                throw response.headers('X-SCT-Alert');
            });
    };


    function addAnnouncement(announcement) {
        return $http.post(CONFIG.SERVICE_URL + '/announcements', announcement)
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(repsponse) {
                $log.warn(response.headers('X-SCT-Alert'));
                throw response.headers('X-SCT-Alert');
            });
    };

    function getSimilarRealEstates(realEstate) {
        return $http.get(CONFIG.SERVICE_URL + '/real-estates/similar',
            {
                params: {
                    area:    realEstate.area,
                    country: realEstate.location.country,
                    city:    realEstate.location.city,
                    region:  realEstate.location.cityRegion,
                    street:  realEstate.location.street,
                    number:  realEstate.location.streetNumber
                }
            })
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                $log.warn(response.headers('X-SCT-Alert'));
                throw response.headers('X-SCT-Alert');
            });
    };

    function getRealEstateImage(id) {
        return $http.get(CONFIG.SERVICE_URL + '/real-estates/' + id + '/image')
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                $log.warn(response.headers('X-SCT-Alert'));
                throw response.headers('X-SCT-Alert');
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
                $log.warn(response.headers('X-SCT-Alert'));
                throw response.headers('X-SCT-Alert');
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
                $log.warn(response.headers('X-SCT-Alert'));
                throw response.headers('X-SCT-Alert');
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
                $log.warn(response.headers('X-SCT-Alert'));
                throw response.headers('X-SCT-Alert');
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
    function searchAnnouncements(searchTerm, page, size, sort) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/search?' + searchTerm + 'page=' + page + '&size=' + size + '&sort=' + sort)
            .then(function successCallback(response) {
                return response;
            },
            function errorCallback(response) {
                $log.warn(response.headers('X-SCT-Alert'));
                throw response.headers('X-SCT-Alert');
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
                $log.warn(response.headers('X-SCT-Alert'));
                throw response.headers('X-SCT-Alert');
            });
    };


    /**
     * Update one announcement.
     *
     * @param {any} announcement   announcement that will be updated
     * @returns response
     */
    function updateAnnouncement(announcement) {
        return $http.put(CONFIG.SERVICE_URL + '/announcements', announcement)
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                $log.warn(response.headers('X-SCT-Alert'));
                throw response.headers('X-SCT-Alert');
            });
    };

    /**
     * Verifies announcement.
     *
     * @param {integer} announcementId
     * @returns response
     */
    function verifyAnnouncement(announcementId) {
        return $http.put(CONFIG.SERVICE_URL + '/announcements/' + announcementId + '/verify')
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                $log.warn(response.headers('X-SCT-Alert'));
                throw response.headers('X-SCT-Alert');
            });
    };

    /**
     * Function that uploads dummy image.
     *
     * @param {object} image
     * @param {int}    index
     * @param {object} uploader
     */
     function dummyImageUpload(image, index, uploader) {
         $http.get(image.imagePath, { responseType: "blob" })
             .then(function successCallback(response) {
                 var mimetype = response.data.type;
                 var file = new File([response.data], "Slika" + (index + 1), { type: mimetype });
                 var dummy = new FileUploader.FileItem(uploader, {});

                 dummy._file = file;
                 dummy.progress = 100;
                 dummy.isUploaded = true;
                 dummy.isSuccess = true;
                 dummy.file = {
                     size: response.data.size,
                     name: 'Slika' + (index + 1),
                     realImg: image
                 };
                 uploader.queue.push(dummy);
             }, function errorCallback(data, status, headers, config) {
                 $log.error("Wrong image url.");
             });
     };
}