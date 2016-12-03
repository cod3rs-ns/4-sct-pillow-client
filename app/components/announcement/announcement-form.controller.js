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
        realEstate: {
            id: null,
            name: "",
            type: "",
            area: 120.3,
            heatingType: "",
            equipment: "",
            deleted: false,
            location: {
                id: null,
                country: "",
                city: "",
                cityRegion: "",
                street: "",
                streetNumber: ""
            },
            announcements : []
        } //TODO: change real estate object 
    };

    // Date picker functions
    announcementFormVm.today = today
    announcementFormVm.clear = clear;
    announcementFormVm.open = open;
    announcementFormVm.datePickerConfig = datePickerConfig;
    announcementFormVm.getDayClass = getDayClass;
    announcementFormVm.addAnnouncement = addAnnouncement;

    activate();

    function activate() {
        announcementFormVm.datePickerConfig();
        announcementFormVm.uploaded = false;
    }

    function addAnnouncement() {
        console.log(announcementFormVm.announcement);
        announcementFormVm.uploader.uploadAll();
    }

    function today() {
        announcementFormVm.announcement.expirationDate = new Date();
    };

    function clear() {
        announcementFormVm.announcement.expirationDate = null;
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
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // Callbacks for image upload
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        announcementFormVm.announcement.images.push({ id: null, imagePath: response });
        console.info('onSuccessItem', fileItem, response, status, headers);
    };

    uploader.onCompleteAll = function() {
        announcementFormVm.uploaded = true;

        announcementService.addAnnouncement(announcementFormVm.announcement)
            .then(function(response) {
                console.log(response);
            });
        console.info('onCompleteAll');
    };
}
