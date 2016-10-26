angular
    .module('awt-cts-client')
    .controller('FooterController', FooterController);

function FooterController($http) {
    var footerVm = this;

    console.log("Footer Controller init!");

    footerVm.copyright = "2016 SW3/SW9/SWF/SW20 team";
    footerVm.faculty = "Faculty of Technical Sciences, Novi Sad";
    footerVm.course = "AWT & CTS";
}
