angular
    .module('awt-cts-client')
    .controller('HeaderController', HeaderController);

function HeaderController($http) {
    var headerVm = this;

    console.log("Header Controller init!");

    headerVm.projectName = "AWT CTS project";
}
