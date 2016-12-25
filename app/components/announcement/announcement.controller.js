(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('AnnouncementController', AnnouncementController);

    AnnouncementController.$inject = ['$stateParams', '$log', '_', 'announcementService', 'commentService'];

    function AnnouncementController($stateParams, $log, _, announcementService, commentService) {
        var announcementVm = this;

        announcementVm.announcement = {};
        announcementVm.images = [];
        announcementVm.address = null;
        announcementVm.comments = [];
        announcementVm.comment = null;

        announcementVm.getAnnouncement = getAnnouncement;
        announcementVm.initMap = initMap;
        announcementVm.addComment = addComment;

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

                    commentService.getCommentsForAnnouncement($stateParams.announcementId)
                        .then(function(response) {
                             _.forEach(response.data, function(comment) {
                                announcementVm.comments.push(
                                  {
                                    'content': comment.content,
                                    'date': comment.date,
                                    'author':
                                        {
                                            'name': comment.author.firstName + ' ' + comment.author.lastName,
                                            'image': "http://img.uefa.com/imgml/TP/players/3/2016/324x324/250063984.jpg"
                                        }
                                  }
                                );
                             });
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

        function addComment() {
            var comment = {};

            // comment.author = { 'id': 1 };
            comment.announcement = { 'id': _.toInteger($stateParams.announcementId) };
            comment.content = announcementVm.comment;
            comment.date = _.now();

            commentService.addComment(comment)
                .then(function(response) {
                    var comment = response.data;

                    announcementVm.comments.push(
                      {
                        'content': comment.content,
                        'date': comment.date,
                        'author':
                            {
                                'name': comment.author.firstName + ' ' + comment.author.lastName,
                                'image': "http://img.uefa.com/imgml/TP/players/3/2016/324x324/250063984.jpg"
                            }
                      });
                });
        }

    }
})();