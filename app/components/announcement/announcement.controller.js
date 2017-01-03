(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('AnnouncementController', AnnouncementController);

    AnnouncementController.$inject = ['$stateParams', '$timeout', '$log', '$localStorage', '_', 'announcementService', 'commentService', 'markService'];

    function AnnouncementController($stateParams, $timeout, $log, $localStorage, _, announcementService, commentService, markService) {
        var announcementVm = this;

        announcementVm.announcement = {};
        announcementVm.images = [];
        announcementVm.address = null;
        announcementVm.comments = [];
        announcementVm.comment = null;
        announcementVm.vote = {
          'announcer': null,
          'announcement': null
        };
        announcementVm.rating = {
          'announcer': -1,
          'announcement': -1
        };
        announcementVm.votes = {
          'announcer': {
              'average': 0,
              'count': 0
          },
          'announcement': {
              'average': 0,
              'count': 0
          }
        };

        announcementVm.getAnnouncement = getAnnouncement;
        announcementVm.initMap = initMap;
        announcementVm.addComment = addComment;
        announcementVm.updateComment = updateComment;
        announcementVm.deleteComment = deleteComment;
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

                                var isMy = false;
                                if (comment.author !== null) {
                                    var author = {
                                      'name': comment.author.firstName + ' ' + comment.author.lastName,
                                      'image': "http://img.uefa.com/imgml/TP/players/3/2016/324x324/250063984.jpg"
                                    }

                                    isMy = $localStorage.user === comment.author.username;
                                    $log.log(isMy);
                                }
                                else {
                                    var author = {
                                      'name': 'Gost na sajtu',
                                      'image': "http://megaicons.net/static/img/icons_sizes/8/178/512/user-role-guest-icon.png"
                                    }
                                }

                                announcementVm.comments.push(
                                  {
                                    'id': comment.id,
                                    'content': comment.content,
                                    'date': comment.date,
                                    'author': author,
                                    'isMy': isMy
                                  }
                                );
                             });
                        });

                    var role = $localStorage.role;

                    markService.getMarksForAnnouncement(announcementId)
                        .then(function (response) {
                            announcementVm.votes.announcement.average = _.meanBy(response.data, function(mark) {
                                  return mark.value;
                                }) || 0;

                            $log.log(announcementVm.votes.announcement.average);

                            announcementVm.votes.announcement.count = _.size(response.data) || 0;
                            $log.log(announcementVm.votes.announcement.count);

                            var myVote = _.find(response.data, function(o) { return o.grader.username === $localStorage.user; });
                            var exist = _.size(myVote) !== 0;

                            announcementVm.vote.announcement = myVote;

                            announcementVm.rating.announcement = (exist) ? myVote.value : -1;
                            announcementVm.isAnnouncementMarkEnabled = (role === 'advertiser' || role === 'verifier'); // && !exist;
                        });

                    markService.getMarksForAnnouncer(announcementVm.announcement.author.id)
                        .then(function (response) {
                            announcementVm.votes.announcer.average = _.meanBy(response.data, function(mark) {
                                  return mark.value;
                                }) || 0;
                            $log.log(announcementVm.votes.announcer.average);

                            announcementVm.votes.announcer.count = _.size(response.data) || 0;
                            $log.log(announcementVm.votes.announcer.count);

                            var myVote = _.find(response.data, function(o) { return o.grader.username === $localStorage.user; });
                            var exist = _.size(myVote) !== 0;

                            announcementVm.vote.announcer = myVote;

                            announcementVm.rating.announcer = (exist) ? myVote.value : -1;
                            announcementVm.isAnnouncerMarkEnabled = (role === 'advertiser' || role === 'verifier'); // && !exist;
                        });
                });
        }

        function initMap() {
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16
            });
            var geocoder = new google.maps.Geocoder();

            $timeout(function() {
                // Refresh map and find center
                google.maps.event.trigger(map, 'resize');
                geocodeAddress(geocoder, map);
            }, 100);
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
                    announcementVm.comment = "";
                    var comment = response.data;

                    var author;
                    var isMy = false;
                    if (comment.author !== null) {
                        author = {
                            'name': comment.author.firstName + ' ' + comment.author.lastName,
                            'image': "http://img.uefa.com/imgml/TP/players/3/2016/324x324/250063984.jpg"
                        }
                        isMy = $localStorage.user === comment.author.username;
                    }
                    else {
                        author = {
                            'name': 'Gost na sajtu',
                            'image': "http://megaicons.net/static/img/icons_sizes/8/178/512/user-role-guest-icon.png"
                        }
                    }

                    announcementVm.comments.push(
                      {
                        'id': comment.id,
                        'content': comment.content,
                        'date': comment.date,
                        'author': author,
                        'isMy': isMy
                      });
                });
        }

        function updateComment(comment) {

          comment.announcement = { 'id': _.toInteger($stateParams.announcementId) };
          comment.date = _.now();
          comment.content = announcementVm.editedComment;

          delete comment.isMy;

          commentService.updateComment(comment)
              .then(function(response) {
                  comment.isMy = true;
                  announcementVm.editing = undefined;
              });
        }

        function deleteComment(id) {
          commentService.deleteComment(id)
              .then(function(response) {
                  _.remove(announcementVm.comments, function(comment) {
                      return comment.id == id;
                  });
              });
        }

        function voteAnnouncement(rating) {
            var mark = {};

            if (announcementVm.vote.announcement === undefined) {
                mark.announcement = { 'id': _.toInteger($stateParams.announcementId) };
                mark.value = _.toInteger(rating);

                markService.vote(mark)
                    .then(function(response) {
                        announcementVm.vote.announcement = response.data;

                        var val = response.data.value;
                        var cnt = announcementVm.votes.announcement.count;
                        var avg = announcementVm.votes.announcement.average;
                        announcementVm.votes.announcement.average = (avg*cnt + val)/(cnt + 1);
                        ++announcementVm.votes.announcement.count;
                    });
            }
            else {
                mark = announcementVm.vote.announcement;
                var oldVal = mark.value;
                mark.value = _.toInteger(rating);

                markService.updateVote(mark)
                    .then(function(response) {
                        announcementVm.vote.announcement = response.data;

                        var val = response.data.value;
                        var cnt = announcementVm.votes.announcement.count;
                        var avg = announcementVm.votes.announcement.average;
                        announcementVm.votes.announcement.average = (avg*cnt + val - oldVal)/(cnt);
                    });
            }
        }

        function voteAnnouncer(rating) {
            var mark = {};

            if (announcementVm.vote.announcer === undefined) {
                mark.gradedAnnouncer = { 'id': _.toInteger(announcementVm.announcement.author.id) };
                mark.value = _.toInteger(rating);

                markService.vote(mark)
                    .then(function(response) {
                        announcementVm.vote.announcer = response.data;

                        var val = response.data.value;
                        var cnt = announcementVm.votes.announcer.count;
                        var avg = announcementVm.votes.announcer.average;
                        announcementVm.votes.announcer.average = (avg*cnt + val)/(cnt + 1);
                        ++announcementVm.votes.announcer.count;
                    });
            }
            else {
                mark = announcementVm.vote.announcer;
                var oldVal = mark.value;
                mark.value = _.toInteger(rating);

                markService.updateVote(mark)
                    .then(function(response) {
                        announcementVm.vote.announcer = response.data;

                        var val = response.data.value;
                        var cnt = announcementVm.votes.announcer.count;
                        var avg = announcementVm.votes.announcer.average;
                        announcementVm.votes.announcer.average = (avg*cnt + val - oldVal)/(cnt);
                    });
            }
        }

    }

})();