angular
    .module('awt-cts-client')
    .controller('AnnouncementFormController', AnnouncementFormController);

AnnouncementFormController.$inject = ['$scope', '$window', 'FileUploader', 'announcementService', 'CONFIG'];

function AnnouncementFormController($scope, $window, FileUploader, announcementService, CONFIG) {

    var announcementFormVm = this;
    announcementFormVm.announcement = {
        id: null,
        name: "",
        phoneNumber: "",
        price: 0,
        expirationDate: new Date(),
        images: [],
        type: 'buy',
        realEstateId: 1 //TODO: change 
    };

    // Date picker functions
    announcementFormVm.today = today
    announcementFormVm.clear = clear;
    announcementFormVm.toggleMin = toggleMin;
    announcementFormVm.open = open;
    announcementFormVm.datePickerConfig = datePickerConfig;
    announcementFormVm.getDayClass = getDayClass;
    announcementFormVm.addAnnouncement = addAnnouncement;

    activate();

    function activate() {
        announcementFormVm.datePickerConfig();
    }

    function addAnnouncement() {
        console.log(announcementFormVm.announcement);
        announcementService.addAnnouncement(announcementFormVm.announcement)
            .then(function (response) {
                console.log("AAAAAAA");
            });
    }

    function today() {
        announcementFormVm.announcement.expirationDate = new Date();
    };

    function clear() {
        announcementFormVm.announcement.expirationDate = null;
    };

    function toggleMin() {
        announcementFormVm.inlineOptions.minDate = announcementFormVm.inlineOptions.minDate ? null : new Date();
        announcementFormVm.dateOptions.minDate = announcementFormVm.inlineOptions.minDate;
    };

    function open() {
        announcementFormVm.popup.opened = true;
    };

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

    function datePickerConfig() {
        announcementFormVm.today();

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

        announcementFormVm.toggleMin();

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

    // Upload images
    var token = $window.localStorage.getItem('AUTH_TOKEN');
    var uploader = announcementFormVm.uploader = new FileUploader({
        url: CONFIG.SERVICE_URL + '/announcements/upload',
        headers: {
            "X-Auth-Token": token
        }
    });

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // CALLBACKS
    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        announcementFormVm.announcement.images.push({id: null, imagePath: response});
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
    };
}
