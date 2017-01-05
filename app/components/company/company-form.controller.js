(function () {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('CompanyFormController', CompanyFormController);

    CompanyFormController.$inject = ['$scope', '$state', '$stateParams', '$log', '$localStorage', '_', 'companyService', 'FileUploader', 'CONFIG'];

    function CompanyFormController($scope, $state, $stateParams, $log, $localStorage, _, companyService, FileUploader, CONFIG) {

        var companyFormVm = this;

        companyFormVm.clearFile = clearFile;
        companyFormVm.uploadFile = uploadFile;
        companyFormVm.onSelectedUserCallback = onSelectedUserCallback;
        companyFormVm.getUsers = getUsers;
        companyFormVm.submitForm = submitForm;
        companyFormVm.update = update;

        activate();

        function activate() {
            companyFormVm.btnName = "Pretraži"
            companyFormVm.clearHide = false;
            companyFormVm.state = $state.current.name;

            if (companyFormVm.state == 'addCompany') {
                companyFormVm.company = {};
                companyFormVm.fileName = "";
                companyFormVm.imageSource = "http://www.genaw.com/linda/translucent_supplies/translucent_mask3.png";
                companyFormVm.submitBtnName = 'Dodaj agenciju';
            }
            else {
                companyFormVm.submitBtnName = 'Izmeni agenciju';

                companyService.getCompanyById($stateParams.companyId)
                    .then(function (response) {
                        companyFormVm.company = response.data;
                        companyFormVm.imageSource = response.data.imagePath;
                    })
                    .catch(function (error) {
                        $log.error(error);
                    });
            }
        }

        var headerToken = CONFIG.AUTH_TOKEN;
        // Upload images
        var uploader = companyFormVm.uploader = new FileUploader({
            url: CONFIG.SERVICE_URL + '/images/company/',
            headers: {
                headerToken: $localStorage.token
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

        uploader.onAfterAddingFile = function (fileItem) {
            if (uploader.queue.length > 1) {
                uploader.queue.shift();
            }

            uploadFile();
        };

        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            companyFormVm.company.imagePath = response;

            if (companyFormVm.state == 'addCompany') {
                companyFormVm.company.users = [companyFormVm.selectedUser];
                companyService.createCompany(companyFormVm.company)
                    .then(function (response) {
                        $state.transitionTo("company", {
                            companyId: response.data.id
                        })
                        .catch(function (error) {
                            $log.error(error);
                        });
                    });
            }
            else {
                companyFormVm.update();
            }
        };

        function update() {
            companyService.updateCompany(companyFormVm.company)
                .then(function (response) {
                    $state.transitionTo("company", {
                        companyId: response.data.id
                    })
                    .catch(function (error) {
                        $log.error(error);
                    });
                });
        }

        function uploadFile() {
            companyFormVm.currentFile = event.target.files[0];
            var reader = new FileReader();

            reader.onload = function (e) {
                companyFormVm.btnName = "Izmijeni"
                companyFormVm.clearHide = true;
                companyFormVm.fileName = companyFormVm.currentFile.name;

                companyFormVm.imageSource = e.target.result;
                $scope.$apply();
            }

            // When the file is read it triggers the onload event above.
            reader.readAsDataURL(event.target.files[0]);
        }

        function clearFile() {
            companyFormVm.btnName = "Pretraži";
            companyFormVm.clearHide = false;
            companyFormVm.fileName = "";
            companyFormVm.imageSource = "http://www.genaw.com/linda/translucent_supplies/translucent_mask3.png";
            uploader.queue = [];
        }

        function getUsers(val) {
            var splitted = val.split(/ +/);
            return companyService.findUsers(splitted[0], splitted[1] || "")
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };

        function onSelectedUserCallback($item, $model, $label) {
            companyFormVm.selectedUser = $item
            companyFormVm.selectedItem = $item.firstName + " " + $item.lastName;
        };

        function submitForm() {
            if (_.isEmpty(uploader.queue) && companyFormVm.state == 'updateCompany') {
                companyFormVm.update();
            } else {
                uploader.uploadItem(uploader.queue[0]);
            }
        };
    }
})();