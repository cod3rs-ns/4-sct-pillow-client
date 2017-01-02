(function () {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('VerificationTokenController', VerificationTokenController);

    VerificationTokenController.$inject = ['$scope', '$state', '$http', '$log', 'VerificationTokenService'];

    function VerificationTokenController($scope, $state, $http, $log, VerificationTokenService) {
        var verificationTokenVm = this;

        verificationTokenVm.username = "";
        verificationTokenVm.sendMailAgain = sendMailAgain;

        function sendMailAgain() {
            VerificationTokenService.resendToken(verificationTokenVm.username)
                .then(function (response) {
                    $log.info("Verification token is resend successfully.");
                });
        }
    }
})();