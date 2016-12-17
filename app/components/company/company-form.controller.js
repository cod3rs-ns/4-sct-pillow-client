(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('CompanyFormController', CompanyFormController);

    CompanyFormController.$inject = ['$scope', '$state', '$stateParams', '$log', 'companyService'];

    function CompanyFormController($scope, $state, $stateParams, $log, companyService) {

        var companyFormVm = this;

        companyFormVm.company = {};
        companyFormVm.fileName = "";
        companyFormVm.image_source = "http://www.genaw.com/linda/translucent_supplies/translucent_mask3.png";
        companyFormVm.btnName = "Pretraži"
        companyFormVm.clearHide = false;

        companyFormVm.addCompany = addCompany;
        companyFormVm.clearFile = clearFile;
        companyFormVm.uploadFile = uploadFile;

        function addCompany() {
            $log.log(companyFormVm.company);
        }

        function uploadFile(event) {
            companyFormVm.currentFile = event.target.files[0];
            var reader = new FileReader();

            reader.onload = function (e) {
                companyFormVm.btnName = "Izmijeni"
                companyFormVm.clearHide = true;
                companyFormVm.fileName = companyFormVm.currentFile.name;

                companyFormVm.image_source = e.target.result;
                $scope.$apply();
            }
            // When the file is read it triggers the onload event above.
            reader.readAsDataURL(event.target.files[0]);
        }

        function clearFile() {
            $log.info("Clear");
            companyFormVm.btnName = "Pretraži";
            companyFormVm.clearHide = false;
            companyFormVm.fileName = "";
            companyFormVm.image_source = "http://www.genaw.com/linda/translucent_supplies/translucent_mask3.png";
        }
    }

    angular.module('awt-cts-client').directive('customOnChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeHandler);
            }
        };
    });
})();