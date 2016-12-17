(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$log'];

    function HeaderController($log) {
        var headerVm = this;

        $log.info("Header Controller init!");

        headerVm.projectName = "AWT CTS project";
    }
})();