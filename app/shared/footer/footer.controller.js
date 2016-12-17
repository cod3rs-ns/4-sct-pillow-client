(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('FooterController', FooterController);

    FooterController.$inject = ['$log'];

    function FooterController($log) {
        var footerVm = this;

        $log.info("Footer Controller init!");

        footerVm.copyright = "2016 SW3/SW9/SWF/SW20 team";
        footerVm.faculty = "Faculty of Technical Sciences, Novi Sad";
        footerVm.course = "AWT & CTS";
    }
})();