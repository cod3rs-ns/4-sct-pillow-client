angular
    .module('awt-cts-client')
    .controller('AboutController', AboutController);

function AboutController($http) {
    var homeVm = this;

    console.log("About Controller init!");
    
    homeVm.authors = [  "SW3-2013  Stefan Ristanović",
                        "SW9-2013  Bojan Blagojević",
                        "SWF-2013  Dragutin Marjanović",
                        "SW20-2013 Aleksa Zrnić"];
}
