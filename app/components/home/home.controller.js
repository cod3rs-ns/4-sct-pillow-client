angular
    .module('awt-cts-client')
    .controller('HomeController', HomeController);

function HomeController($http) {
    var homeVm = this;

    console.log("Home Controller init!");

    homeVm.image = "assets/img/example.png";
    homeVm.title = "AWT CTS homepage";
    homeVm.content = "This is HOME page template for our project (with app structure). Hope you'll like it! :)"
}
