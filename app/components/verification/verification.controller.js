(function () {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('VerificationTokenController', VerificationTokenController);

    VerificationTokenController.$inject = ['$state', '$http', '$log', 'verificationTokenService'];

    function VerificationTokenController($state, $http, $log, verificationTokenService) {
        var verificationTokenVm = this;

        verificationTokenVm.username = "";
        verificationTokenVm.sendMailAgain = sendMailAgain;

        function sendMailAgain() {
            verificationTokenService.resendToken(verificationTokenVm.username)
                .then(function (response) {
                    $log.info("Verification token is resend successfully.");
                });
        }
    }
})();