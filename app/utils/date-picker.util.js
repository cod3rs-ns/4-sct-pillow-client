(function() {
'use strict';

    angular
        .module('awt-cts-client')
        .factory('DatePickerService', DatePickerService);

    function DatePickerService() {

        var service = {
            getConfiguration : getConfiguration
        };

        return service;

        function getConfiguration() {
            var pickerCfg = {};

            // Date picker functions
            pickerCfg.today = today
            pickerCfg.open = open;
            pickerCfg.getDayClass = getDayClass;

            pickerCfg.inlineOptions = {
                    minDate: new Date(),
                    showWeeks: true
            };

            pickerCfg.dateOptions = {
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };

            pickerCfg.formats = ['dd/MM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            pickerCfg.format = pickerCfg.formats[0];
            pickerCfg.altInputFormats = ['M!/d!/yyyy'];

            pickerCfg.popup = {
                opened: false
            };

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 1);
            pickerCfg.events = [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

            function today() {
                return new Date();
            };


            function open() {
                pickerCfg.popup.opened = true;
            };

            function getDayClass(data) {
                var date = data.date,
                    mode = data.mode;
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date(pickerCfg.events[i].date).setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return pickerCfg.events[i].status;
                        }
                    }
                }

                return '';
            }

        return pickerCfg;
        }
    }

})();