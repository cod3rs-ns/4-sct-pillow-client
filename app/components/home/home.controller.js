(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$state', '$document', '$timeout', '$log', '_', 'announcementService'];

    function HomeController($state, $document, $timeout, $log, _, announcementService) {
        var homeVm = this;

        homeVm.announcements = {};

        // Pagination init params
        homeVm.page = 0;
        homeVm.itemsPerPage = 10;
        homeVm.sortBy = 'id,desc';

        homeVm.getAllAnnouncements = getAllAnnouncements;
        homeVm.find = find;
        homeVm.initMap = initMap;
        homeVm.showMapResult = showMapResult;

        activate();

        function activate () {
          homeVm.getAllAnnouncements();
        }

        function initMap() {
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 45.252711, lng: 19.841499},
                zoom: 15
            });
            var geocoder = new google.maps.Geocoder();

            var tooltip = new google.maps.InfoWindow({map: map});

            $timeout(function() {
                // Refresh map and find center
                google.maps.event.trigger(map, 'resize');

                // Try HTML5 geolocation.
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var yourPosition = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        tooltip.setPosition(yourPosition);
                        tooltip.setContent('Vi ste ovdje! :)');
                        map.setCenter(yourPosition);

                    }, function() {
                        handleLocationError(true, tooltip, map.getCenter());
                    });
                } else {
                    // Browser doesn't support Geolocation
                    handleLocationError(false, tooltip, map.getCenter());
                }
            }, 500);

            google.maps.event.addListener(map, 'bounds_changed', function() {
                var ne = map.getBounds().getNorthEast();
                var sw = map.getBounds().getSouthWest();

                announcementService.getAnnouncementsInArea(ne, sw)
                    .then(function (response) {
                        var announcements = response.data;

                        homeVm.mapAnnouncements = announcements;

                        _.forEach(response.data, function(announcement) {
                            var location = announcement.realEstate.location;
                            var position = {
                              lat: location.latitude,
                              lng: location.longitude
                            };

                            var marker = new google.maps.Marker({
                                position: position,
                                map: map,
                                title: announcement.name
                            });

                            var dialog = new google.maps.InfoWindow({
                                content: formatContent(announcement)
                            })

                            marker.addListener('click', function() {
                                dialog.open(map, marker);
                            });
                        });

                    });
            });
        }

        function geocodeAddress(geocoder, resultsMap) {
            var address = 'Petra Drapsina 5 Novi Sad Serbia';

            geocoder.geocode({ 'address': address }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    resultsMap.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: resultsMap,
                        position: results[0].geometry.location
                    });
                } else {
                    $log.error('Geocode was not successful for the following reason: ' + status);
                }
            });
        }

        function getAllAnnouncements() {
            announcementService.getAnnouncements(homeVm.page, homeVm.itemsPerPage, homeVm.sortBy)
                .then(function(response) {
                    $log.log(response);
                    homeVm.announcements = response.data;
                    homeVm.totalItems = response.headers('X-Total-Count');
                });
        }

        function find() {
            var searchTerm = "";

            _.forEach(homeVm.search, function(value, key) {
                if (value !== '' && value !== undefined) {
                    searchTerm += key + "=" + value + "&";
                }
            });

            announcementService.searchAnnouncements(searchTerm)
                .then(function(response) {
                    homeVm.announcements = response.data;
                });
        }

        function showMapResult() {
            homeVm.announcements = homeVm.mapAnnouncements;
        }

        function formatContent(announcement) {
            return '<div class="media">' +
              '<div class="media-left">' +
                '<a href="#">' +
                  '<img class="media-object" src="' + 'http://avatarbox.net/avatars/img11/we_love_house_avatar_picture_68917.jpg' + '" alt="...">' +
                '</a>' +
              '</div>' +
              '<div class="media-body">' +
                '<h4 class="media-heading">' + announcement.name + '</h4>' +
                announcement.description +
                '<a ui-sref="announcement({announcementId: ' + announcement.id + '})" type="button" class="btn btn-primary pull-right">Prikaži detalje</a>' +
              '</div>' +
            '</div>';
        }

        function handleLocationError(browserHasGeolocation, tooltip, pos) {
            var content = (browserHasGeolocation) ? "Ne dozvoljavate Vaše lociranje." : "Vaš pretraživač ne podržava ovu uslugu.";

            tooltip.setPosition(pos);
            tooltip.setContent(content);
      }
    }
})();