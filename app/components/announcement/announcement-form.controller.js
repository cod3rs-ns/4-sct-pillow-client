(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('AnnouncementFormController', AnnouncementFormController);

    AnnouncementFormController.$inject = ['$http', '$scope', '$state', '$stateParams', '$localStorage', '$log', '_', 'ngToast', 'FileUploader', 'announcementService', 'reportingService', 'WizardHandler', 'CONFIG'];

    function AnnouncementFormController($http, $scope, $state, $stateParams, $localStorage, $log, _, ngToast, FileUploader, announcementService, reportingService, WizardHandler, CONFIG) {

        var announcementFormVm = this;

        announcementFormVm.chosenSimilarRealEstateId = -1;
        announcementFormVm.similars = [];
        announcementFormVm.similarsDisabled = true;

        // Date picker functions
        announcementFormVm.today = today
        announcementFormVm.clear = clear;
        announcementFormVm.open = open;
        announcementFormVm.datePickerConfig = datePickerConfig;
        announcementFormVm.getDayClass = getDayClass;

        announcementFormVm.submitAnnouncement = submitAnnouncement;
        announcementFormVm.chooseSimilarRealEstate = chooseSimilarRealEstate;
        announcementFormVm.getSimilarRealEstates = getSimilarRealEstates;
        announcementFormVm.deleteItemFromQueue = deleteItemFromQueue;
        announcementFormVm.canExitFirtsStep = canExitFirtsStep;
        announcementFormVm.setRealEstateForm = setRealEstateForm;
        announcementFormVm.setAnnouncementForm = setAnnouncementForm;

        activate();

        function activate() {
            announcementFormVm.state = $state.current.name;

            var headerToken = CONFIG.AUTH_TOKEN;
            announcementFormVm.uploader = new FileUploader({
                url: CONFIG.SERVICE_URL + '/images/announcements/',
                headers: {
                    headerToken: $localStorage.token
                }
            });

            setUploaderFilters();
            createUploaderCallbacks();

            if (announcementFormVm.state == 'addAnnouncement') {
                announcementFormVm.announcement = createInitialAnnouncement();
                announcementFormVm.today();
                announcementFormVm.datePickerConfig();
                announcementFormVm.uploaded = false;
            }
            else {
                announcementFormVm.datePickerConfig();
                announcementService.getAnnouncementById($stateParams.announcementId)
                    .then(function(response) {
                        announcementFormVm.announcement = response.data;
                        _.forEach(response.data.images, function(image, index) {
                            var url = image.imagePath;

                            $http.get(url, { responseType: "blob" })
                                .then(function successCallback(response) {
                                    var mimetype = response.data.type;
                                    var file = new File([response.data], "Slika" + (index + 1), { type: mimetype });
                                    var dummy = new FileUploader.FileItem(announcementFormVm.uploader, {});

                                    dummy._file = file;
                                    dummy.progress = 100;
                                    dummy.isUploaded = true;
                                    dummy.isSuccess = true;
                                    dummy.file = {
                                        size: response.data.size,
                                        name: 'Slika' + (index + 1),
                                        realImg: image
                                    };
                                    announcementFormVm.uploader.queue.push(dummy);
                                }, function errorCallback(data, status, headers, config) {
                                    $log.info("Wrong image url.");
                                });
                        })
                        .catch(function (error) {
                            $log.error(error);
                        });

                        announcementFormVm.uploader.progress = 100;
                    });
            }
        }

        function submitAnnouncement() {
            var notUploaded = announcementFormVm.uploader.getNotUploadedItems();

            if (announcementFormVm.state == "updateAnnouncement" && _.isEmpty(notUploaded)) {
                updateAnnouncement(announcementFormVm.announcement);
            }
            else {
                announcementFormVm.uploader.uploadAll();
            }
        }

        function today() {
            announcementFormVm.announcement.expirationDate = _.now();
        };

        function clear() {
            announcementFormVm.announcement.expirationDate = null;
        };

        function open() {
            announcementFormVm.popup.opened = true;
        };

        // FIXME @bblagojevic - refactor this function
        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date(announcementFormVm.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return announcementFormVm.events[i].status;
                    }
                }
            }

            return '';
        }

        // FIXME @bblagojevic - refactor this function
        function datePickerConfig() {
            announcementFormVm.inlineOptions = {
                minDate: new Date(),
                showWeeks: true
            };

            announcementFormVm.dateOptions = {
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };

            announcementFormVm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            announcementFormVm.format = announcementFormVm.formats[0];
            announcementFormVm.altInputFormats = ['M!/d!/yyyy'];

            announcementFormVm.popup = {
                opened: false
            };

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 1);
            announcementFormVm.events = [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];
        }

        function setUploaderFilters() {
            // FILTERS
            announcementFormVm.uploader.filters.push({
                name: 'imageFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            announcementFormVm.uploader.filters.push({
                name: 'enforceMaxFileSize',
                fn: function(item) {
                    var retVal = item.size <= 5242880; // 5 MB
                    if (!retVal) {
                        ngToast.create({
                            className: 'danger',
                            content: '<p>Veličina fajla mora biti manja od <strong>5MB</strong>.</p>'
                        });
                    }
                    return retVal;
                }
            });

            announcementFormVm.uploader.filters.push({
                name: 'queueLimit',
                fn: function(item) {
                    var retVal = announcementFormVm.uploader.queue.length == 4; // 4 images per announcement
                    if (retVal) {
                        ngToast.create({
                            className: 'danger',
                            content: '<p>Ne možete postaviti više od <strong>4</strong> slike.</p>'
                        });
                    }
                    return !retVal;
                }
            });
        }

        function deleteItemFromQueue(item) {
            if (announcementFormVm.state == "updateAnnouncement" && !_.isUndefined(item.file.realImg)) {
                _.remove(announcementFormVm.announcement.images, function(image) {
                    return image.id === item.file.realImg.id;
                })
            }

            item.remove();
        }

        function addNewAnnouncement() {
            announcementService.addAnnouncement(announcementFormVm.announcement)
                .then(function(response) {
                    if (!_.isEmpty(announcementFormVm.similars)) {
                        var report = {
                            email: 'system',
                            content: 'Postoje slične nekretnine',
                            type: 'similar-realEstate',
                            status: 'pending',
                            announcement: { id: response.data.id }
                        }
                        // Create new report if announcement is referenced to existed real estate
                        reportingService.createReport(report);
                    }

                    $state.transitionTo("announcement", {
                        announcementId: response.data.id
                    });
                })
                .catch(function (error) {
                    $log.error(error);
                });
        }

        function updateAnnouncement() {
            announcementService.updateAnnouncement(announcementFormVm.announcement)
                .then(function(response) {
                    if (!_.isEmpty(announcementFormVm.similars)) {
                        var report = {
                            email: 'system',
                            content: 'Postoje slične nekretnine',
                            type: 'similar-realEstate',
                            status: 'pending',
                            announcement: { id: response.data.id }
                        }
                        // Create new report if announcement is referenced to existed real estate
                        reportingService.createReport(report);
                    }

                    $state.transitionTo("announcement", {
                        announcementId: response.data.id
                    });
                })
                .catch(function (error) {
                    $log.error(error);
                });
        }

        function createUploaderCallbacks() {
            // Callbacks for one image upload
            announcementFormVm.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                announcementFormVm.announcement.images.push({ id: null, imagePath: response });

                $log.info('Item upload completed.', fileItem, response, status, headers);
            };

            announcementFormVm.uploader.onCompleteAll = function() {
                announcementFormVm.uploaded = true;

                if (announcementFormVm.state == 'addAnnouncement') {
                    addNewAnnouncement();
                }
                else {
                    updateAnnouncement();
                }

                $log.info('All uploads completed.');
            };
        }

        function chooseSimilarRealEstate(id) {
            announcementFormVm.chosenSimilarRealEstateId = id;
            announcementFormVm.announcement.realEstate.id = id;
        };

        function getSimilarRealEstates() {
            announcementService.getSimilarRealEstates(announcementFormVm.announcement.realEstate)
                .then(function(response) {
                    announcementFormVm.chosenSimilarRealEstateId = null;
                    announcementFormVm.announcement.realEstate.id = null;
                    announcementFormVm.similars = response.data;

                    if (announcementFormVm.state != 'addAnnouncement') {
                        _.remove(announcementFormVm.similars, function(realEstate) {
                            return realEstate.id === announcementFormVm.announcement.realEstate.id;
                        });
                    }

                    if (!_.isEmpty(announcementFormVm.similars)) {
                        announcementFormVm.similarsDisabled = false;
                        WizardHandler.wizard().goTo("Slične nekretnine");
                    }
                    else {
                        announcementFormVm.similarsDisabled = true;
                        WizardHandler.wizard().goTo("Slike");
                    }
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };

        function setAnnouncementForm(form) {
            announcementFormVm.announcementForm = form;
        }

        function setRealEstateForm(form) {
            announcementFormVm.realEstateForm = form;
        }

        function canExitFirtsStep() {
            return !announcementFormVm.announcementForm.$invalid && !announcementFormVm.realEstateForm.$invalid;
        }

        function createInitialAnnouncement() {
            return {
                dateAnnounced: _.now(),
                expirationDate: _.now(),
                verified: false,
                images: [],
                description: '',
                type: 'buy',
                realEstate: {
                    deleted: false,
                    type: 'other',
                    heatingType: 'central',
                    location: {},
                    announcements: []
                }
            };
        }
    }
})();