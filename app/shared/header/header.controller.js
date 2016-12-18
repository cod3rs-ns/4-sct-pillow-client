(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$log', '$localStorage'];

    function HeaderController($log, $localStorage) {
        var headerVm = this;

        headerVm.$storage = $localStorage.$default({
          role: 'guest',
          user: null
        });

        activate();

        function activate () {
            $log.info("Header Controller init!");
            $log.info("Role " + headerVm.$storage.role);
        }

        headerVm.projectName = "AWT CTS project";
    }
})();