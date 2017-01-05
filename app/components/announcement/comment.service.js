(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .service('commentService', commentService);

    commentService.$inject = ['$http', '$log', 'CONFIG'];

    function commentService($http, $log, CONFIG) {
        var service = {
          getCommentsForAnnouncement: getCommentsForAnnouncement,
          addComment: addComment,
          updateComment: updateComment,
          deleteComment: deleteComment
        };

        return service;

        function getCommentsForAnnouncement(id) {
            return $http.get(CONFIG.SERVICE_URL + '/comments/announcement/' + id)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  $log.warn(response.headers('X-SCT-Alert'));
                  throw response.headers('X-SCT-Alert');
              });
        };

        function addComment(comment) {
            return $http.post(CONFIG.SERVICE_URL + '/comments', comment)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  $log.warn(response.headers('X-SCT-Alert'));
                  throw response.headers('X-SCT-Alert');
              });
        };

        function updateComment(comment) {
            return $http.put(CONFIG.SERVICE_URL + '/comments', comment)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(repsponse) {
                  $log.warn(response.headers('X-SCT-Alert'));
                  throw response.headers('X-SCT-Alert');
              });
        };

        function deleteComment(id) {
            return $http.delete(CONFIG.SERVICE_URL + '/comments/' + id)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  $log.warn(response.headers('X-SCT-Alert'));
                  throw response.headers('X-SCT-Alert');
              });
        };
    }

})();