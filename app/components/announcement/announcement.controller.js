(function () {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('AnnouncementController', AnnouncementController);

    AnnouncementController.$inject = ['$stateParams', '$timeout', '$log', '$uibModal', '$document', '$localStorage', 'ngToast', '_', 'CommentsUtil', 'MarksUtil',
        'LanguageUtil', 'announcementService', 'commentService', 'markService', 'reportingService'];

    function AnnouncementController($stateParams, $timeout, $log, $uibModal, $document, $localStorage, ngToast, _, CommentsUtil, MarksUtil,
        LanguageUtil, announcementService, commentService, markService, reportingService) {
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
        announcementVm.averageRating = {
            'announcement': true,
            'announcer': true
        }

        announcementVm.$storage = $localStorage.$default({
            role: 'guest'
        });

        announcementVm.getAnnouncement = getAnnouncement;
        announcementVm.initMap = initMap;
        announcementVm.addComment = addComment;
        announcementVm.updateComment = updateComment;
        announcementVm.deleteComment = deleteComment;
        announcementVm.voteAnnouncer = voteAnnouncer;
        announcementVm.voteAnnouncement = voteAnnouncement;
        announcementVm.checkIfUserAlreadyReportAnnouncement = checkIfUserAlreadyReportAnnouncement;
        announcementVm.cancel = cancel;
        announcementVm.verifyAnnouncement = verifyAnnouncement;
        announcementVm.hoverIn = hoverIn;
        announcementVm.hoverOut = hoverOut;

        activate();

        function activate() {
            announcementVm.getAnnouncement($stateParams.announcementId);
        }

        function getAnnouncement(announcementId) {
            announcementService.getAnnouncementById(announcementId)
                .then(function (response) {
                    announcementVm.announcement = response.data;

                    // Do translations
                    var type = announcementVm.announcement.realEstate.heatingType;
                    announcementVm.announcement.realEstate.heatingType = LanguageUtil.translateHeatingType(type);

                    type = announcementVm.announcement.type;
                    announcementVm.announcement.type = LanguageUtil.translateAdvertisementType(type);

                    type = announcementVm.announcement.realEstate.type;
                    announcementVm.announcement.realEstate.type = LanguageUtil.translateRealEstateType(type);

                    announcementVm.address = response.data.realEstate.location;

                    announcementVm.isMyAdvertisement = $localStorage.user === announcementVm.announcement.author.username;

                    _.forEach(response.data.images, function (image, index) {
                        announcementVm.images.push({ 'id': index, 'image': image.imagePath });
                    });

                    announcementVm.checkIfUserAlreadyReportAnnouncement();

                    // Get all comments for announcement
                    commentService.getCommentsForAnnouncement(announcementId)
                        .then(function (response) {
                            _.forEach(response.data, function (comment) {
                                announcementVm.comments.push(CommentsUtil.formatComment(comment));
                            });
                        })
                        .catch(function (error) {
                            $log.error(error);
                        });

                    // Get all marks for announcement
                    var role = $localStorage.role;
                    markService.getMarksForAnnouncement(announcementId)
                        .then(function (response) {
                            var marks = response.data;

                            announcementVm.votes.announcement.average = MarksUtil.average(marks);
                            announcementVm.votes.announcement.count = MarksUtil.count(marks);

                            announcementVm.votesAnnouncementGrouped = _.countBy(marks, function(mark) {
                              return mark.value;
                            }) || {};

                            var myVote = MarksUtil.getMyVote(marks);

                            announcementVm.vote.announcement = myVote;
                            announcementVm.rating.announcement = myVote.value || -1;

                            announcementVm.isAnnouncementMarkEnabled = (role === 'advertiser' || role === 'verifier');
                        })
                        .catch(function (error) {
                            $log.error(error);
                        });

                    // Get all marks for announcer
                    markService.getMarksForAnnouncer(announcementVm.announcement.author.id)
                        .then(function (response) {
                            var marks = response.data;

                            announcementVm.votes.announcer.average = MarksUtil.average(marks);
                            announcementVm.votes.announcer.count = MarksUtil.count(marks);

                            announcementVm.votesAnnouncerGrouped = _.countBy(marks, function(mark) {
                              return mark.value;
                            }) || {};

                            var myVote = MarksUtil.getMyVote(marks);

                            announcementVm.vote.announcer = myVote;
                            announcementVm.rating.announcer = myVote.value || -1;

                            announcementVm.isAnnouncerMarkEnabled = (role === 'advertiser' || role === 'verifier');
                        })
                        .catch(function (error) {
                            $log.error(error);
                        });
                });
        }

        function initMap() {
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16
            });
            var geocoder = new google.maps.Geocoder();

            var position = {
                lat: announcementVm.address.latitude,
                lng: announcementVm.address.longitude
            };

            $timeout(function () {
                // Refresh map and find center
                google.maps.event.trigger(map, 'resize');
                map.setCenter(position);

                var marker = new google.maps.Marker({
                    map: map,
                    position: position
                });

            }, 100);
        }

        function checkIfUserAlreadyReportAnnouncement() {
            if (!_.isNull($localStorage.user)) {
                announcementService.alreadyReported(announcementVm.announcement.id, $localStorage.user)
                    .then(function (response) {
                        announcementVm.alreadyReported = response.data;
                    })
                    .catch(function (error) {
                        $log.error(error);
                    });
            }
        }

        function addComment() {
            var comment = {};

            comment.announcement = { 'id': _.toInteger($stateParams.announcementId) };
            comment.content = announcementVm.comment;
            comment.date = _.now();

            commentService.addComment(comment)
                .then(function (response) {
                    announcementVm.comment = "";
                    var comment = CommentsUtil.formatComment(response.data);

                    announcementVm.comments.push(comment);
                })
                .catch(function (error) {
                    $log.error(error);
                });
        }

        function updateComment(comment) {
            comment.announcement = { 'id': _.toInteger($stateParams.announcementId) };
            comment.date = _.now();
            comment.content = announcementVm.editedComment;

            delete comment.isMy;

            commentService.updateComment(comment)
                .then(function (response) {
                    comment.isMy = true;
                    announcementVm.editing = undefined;
                })
                .catch(function (error) {
                    $log.error(error);
                });
        }

        function deleteComment(id) {
            commentService.deleteComment(id)
                .then(function (response) {
                    _.remove(announcementVm.comments, function (comment) {
                        return comment.id === id;
                    });
                })
                .catch(function (error) {
                    $log.error(error);
                });
        }

        function voteAnnouncement(rating) {
            var mark = {};

            if (_.isEmpty(announcementVm.vote.announcement)) {
                mark.announcement = { 'id': _.toInteger($stateParams.announcementId) };
                mark.value = _.toInteger(rating);

                markService.vote(mark)
                    .then(function (response) {
                        announcementVm.vote.announcement = response.data;
                        var votes = announcementVm.votes.announcement;
                        var value = response.data.value;

                        announcementVm.votes.announcement.average =
                            MarksUtil.updateAverage(value, votes.count++, votes.average);

                        announcementVm.votesAnnouncementGrouped =
                            MarksUtil.groupByCount(announcementVm.votesAnnouncementGrouped, value);
                    })
                    .catch(function (error) {
                        $log.error(error);
                    });
            }
            else {
                mark = announcementVm.vote.announcement;
                var oldVal = mark.value;
                mark.value = _.toInteger(rating);

                markService.updateVote(mark)
                    .then(function (response) {
                        announcementVm.vote.announcement = response.data;
                        var votes = announcementVm.votes.announcement;
                        var value = response.data.value;

                        announcementVm.votes.announcement.average =
                            MarksUtil.updateAverage(value, votes.count, votes.average, oldVal);

                        announcementVm.votesAnnouncementGrouped =
                            MarksUtil.groupByCount(announcementVm.votesAnnouncementGrouped, value, oldVal);
                    })
                    .catch(function (error) {
                        $log.error(error);
                    });
            }
        }

        function voteAnnouncer(rating) {
            var mark = {};

            if (_.isEmpty(announcementVm.vote.announcer)) {
                mark.gradedAnnouncer = { 'id': _.toInteger(announcementVm.announcement.author.id) };
                mark.value = _.toInteger(rating);

                markService.vote(mark)
                    .then(function (response) {
                        announcementVm.vote.announcer = response.data;
                        var votes = announcementVm.votes.announcer;
                        var value = response.data.value;

                        announcementVm.votes.announcer.average =
                            MarksUtil.updateAverage(value, votes.count++, votes.average);

                        announcementVm.votesAnnouncerGrouped =
                            MarksUtil.groupByCount(announcementVm.votesAnnouncerGrouped, value);
                    })
                    .catch(function (error) {
                        $log.error(error);
                    });
            }
            else {
                mark = announcementVm.vote.announcer;
                var oldVal = mark.value;
                mark.value = _.toInteger(rating);

                markService.updateVote(mark)
                    .then(function (response) {
                        announcementVm.vote.announcer = response.data;
                        var votes = announcementVm.votes.announcer;
                        var value = response.data.value;

                        announcementVm.votes.announcer.average =
                            MarksUtil.updateAverage(value, votes.count, votes.average, oldVal);

                        announcementVm.votesAnnouncerGrouped =
                            MarksUtil.groupByCount(announcementVm.votesAnnouncerGrouped, value, oldVal);
                    })
                    .catch(function (error) {
                        $log.error(error);
                    });
            }
        }

        announcementVm.reportAnnouncement = function (size, parentSelector) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/reporting/reporting-form.html',
                controller: 'ReportingFormController',
                controllerAs: 'reportingFormVm',
                size: size,
                resolve: {
                    items: function () {
                        return announcementVm.announcement.id;
                    },
                    user: function () {
                        return $localStorage.user;
                    }
                }
            });

            modalInstance.result.then(function (report) {
                report.createdAt = _.now();
                reportingService.createReport(report)
                    .then(function (response) {
                        ngToast.create({
                            className: 'success',
                            content: '<strong>Oglas je uspješno prijavljen.</strong>'
                        });
                        if (!_.isUndefined($localStorage.user))
                            announcementVm.alreadyReported = true;
                        $log.info('Report is successfully created' + response.data);
                    })
                    .catch(function (error) {
                        $log.error(error);
                    });
            }, function () {
                $log.info('Modal dismissed at: ' + _.now());
            });
        }

        function cancel(event) {
            // If Escape is pressed
            if (27 === event.keyCode) {
                announcementVm.editing = undefined;
            }
        };


        /**
         * Verifes announcement.
         */
        function verifyAnnouncement() {
            announcementService.verifyAnnouncement($stateParams.announcementId)
                .then(function (response) {
                    announcementVm.getAnnouncement($stateParams.announcementId);
                    ngToast.create({
                        className: 'success',
                        content: '<strong>Oglas je uspješno verifikovan.</strong>'
                    });
                })
                .catch(function (error) {
                    ngToast.create({
                        className: 'danger',
                        content: '<p><strong>GREŠKA! </strong>' + error + '</p>'
                    });
                });
        };

        function hoverIn(key) {
            announcementVm.averageRating[key] = false;
        };

        function hoverOut(key) {
            announcementVm.averageRating[key] = true;
        };
    }
})();