(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('ReportingFormController', ReportingFormController);

    ReportingFormController.$inject = ['$scope', '$state', '$localStorage', '$stateParams', '$uibModalInstance', 'items', 'user'];

    function ReportingFormController($scope, $state, $localStorage, $stateParams, $uibModalInstance, items, user) {

        var reportingFormVm = this;

        reportingFormVm.annId = items;
        reportingFormVm.emailInput = user == undefined;
        reportingFormVm.report = {
            id: null,
            email: "",
            status: "", 
            content: "",
            type : 'other',
            announcement : { id: items }
        };

        reportingFormVm.ok = function() {
            $uibModalInstance.close(reportingFormVm.report);
        };

        reportingFormVm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();