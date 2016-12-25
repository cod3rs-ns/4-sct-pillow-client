(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('AnnouncementController', AnnouncementController);

    AnnouncementController.$inject = ['$stateParams', '$log', '_', 'announcementService', 'commentService', 'markService'];

    function AnnouncementController($stateParams, $log, _, announcementService, commentService, markService) {
        var announcementVm = this;

        announcementVm.announcement = {};
        announcementVm.images = [];
        announcementVm.address = null;
        announcementVm.comments = [];
        announcementVm.comment = null;

        announcementVm.getAnnouncement = getAnnouncement;
        announcementVm.initMap = initMap;
        announcementVm.addComment = addComment;
        announcementVm.voteAnnouncer = voteAnnouncer;
        announcementVm.voteAnnouncement = voteAnnouncement;

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

                    commentService.getCommentsForAnnouncement(announcementId)
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

                    markService.getMarksForAnnouncement(announcementId)
                        .then(function (response) {
                            $log.log(response.data);
                            announcementVm.announcementAvg = _.meanBy(
                                _.filter(response.data,
                                  function(mark) {
                                    return mark.gradedAnnouncer == null;
                                  }),

                                function(mark) {
                                  return mark.value;
                                });
                        });

                    markService.getMarksForAnnouncer(announcementVm.announcement.author.id)
                        .then(function (response) {
                            $log.log(response.data);
                            announcementVm.announcerAvg = _.meanBy(
                                _.filter(response.data,
                                  function(mark) {
                                    return mark.announcement == null;
                                  }),

                                function(mark) {
                                  return mark.value;
                                });

                            $log.log(announcementVm.announcerAvg);
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

        function voteAnnouncement(value) {
            var mark = {};

            mark.announcement = { 'id': _.toInteger($stateParams.announcementId) };
            mark.value = _.toInteger(value);

            markService.vote(mark)
                .then(function(response) {
                    $log.log(response.data);
                });
        }

        function voteAnnouncer(value) {
            var mark = {};

            mark.gradedAnnouncer = { 'id': _.toInteger(announcementVm.announcement.author.id) };
            mark.value = _.toInteger(value);

            markService.vote(mark)
                .then(function(response) {
                    $log.log(response.data);
                });
        }

    }
})();