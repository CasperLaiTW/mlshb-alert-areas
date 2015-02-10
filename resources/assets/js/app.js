'use strict';

global.$ = global.jQuery = global.jQuery || require('jquery');

require('togeojson');

$.ajax('/kml/file1.kml')
.done(function (response) {
  var GoogleMapsLoader = require('google-maps');


  GoogleMapsLoader.load(function(google) {
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 10,
      center: {lat: 24.4966867, lng: 120.8978721}
    });

    var infoWindow = new google.maps.InfoWindow({
      content: ""
    });


    map.data.setStyle(function(feature) {
      var mag = 15;
      return /** @type {google.maps.Data.StyleOptions} */({
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: mag,
          fillColor: '#f00',
          fillOpacity: 0.35,
          strokeWeight: 0
        }
      });
    });
    map.data.addGeoJson(toGeoJSON.kml(response));

    map.data.addListener('click', function (event) {
      var description = event.feature.getProperty('description');
      if (description.match(/^<.*>/)) {
        infoWindow.close();
        return;
      }

      infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' + description + '</div>');
      var anchor = new google.maps.MVCObject();
      anchor.set("position", event.latLng);
      infoWindow.open(map, anchor);
    });
  });
});