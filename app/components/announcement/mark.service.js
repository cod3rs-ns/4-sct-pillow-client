(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .service('markService', markService);

    markService.$inject = ['$http', 'CONFIG'];

    function markService($http, CONFIG) {
        var service = {
          getMarksForAnnouncement: getMarksForAnnouncement,
          getMarksForAnnouncer: getMarksForAnnouncer,
          vote: vote,
          updateVote: updateVote
        };

        return service;

        function getMarksForAnnouncement(id) {
            return $http.get(CONFIG.SERVICE_URL + '/marks/announcement/' + id)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw response.headers('X-SCT-Alert');
              });
        };

        function getMarksForAnnouncer(id) {
            return $http.get(CONFIG.SERVICE_URL + '/marks/user/' + id)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw response.headers('X-SCT-Alert');
              });
        };

        function vote(mark) {
            return $http.post(CONFIG.SERVICE_URL + '/marks', mark)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw response.headers('X-SCT-Alert');
              });
        };

        function updateVote(mark) {
            return $http.put(CONFIG.SERVICE_URL + '/marks', mark)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(repsponse) {
                  throw response.headers('X-SCT-Alert');
              });
        };
    }

})();