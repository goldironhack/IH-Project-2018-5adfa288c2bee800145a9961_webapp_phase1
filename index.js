const API_KEY ="AIzaSyAOiREIj7OlVojdyYlEHSZXG5M28Z5WN64";
const DEATHS_URL ="https://data.cdc.gov/api/views/xbxb-epbu/rows.json?accessType=DOWNLOAD";

var map;
var university_coordinates={lat: 40.7291, lng: -73.9965};
var bro_coordinates={lat: 40.650002, lng: -73.949997};
var ny_marker;
var bro_marker;
var directionsService;
var directionsRenderer;
var map1 = new google.maps.Map(document.getElementById('map'), {
  center: {lat: -34.397, lng: 150.644},
  zoom: 8
});
function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: university_coordinates
        });
        ny_marker = new google.maps.Marker({
          position: university_coordinates,
          map: map
        });
        directionsService = new google.maps.DirectionsService();
        directionsRenderer=new google.maps.DirectionsService();
        map.data.loadGeoJson(
          'http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');
        map.data.setStyle(function(feature) {
          return({
            fillColor: "#"+(parseInt(feature.getProperty('BoroCD'),16)*(parseInt("380B61",16))%(parseInt("FFFFFF",16))).toString(16),
            strokeWeight: 1
          });
        });
        map.data.addListener('mouseover', function(event) {
            map.data.revertStyle();
            map.data.overrideStyle(event.feature, {strokeWeight: 2});
            document.getElementById('info-box').textContent =
              event.feature.getProperty('BoroCD');
          });
        map.data.addListener('mouseout', function(event) {
            map.data.revertStyle();
            document.getElementById('info-box').textContent =
              "";
          });
          google.maps.event.addDomListener(window, 'load', initMap);
}

function markerEvents(marker){
    if(!(marker == "undefined")){
      marker.addListener("click",function(){
          getRoute();
      });
  }
}

function getRoute(){
    var request = {
      origin: ny_marker.position,
      destination: bro_marker.position,
      travelMode:'DRIVING'
    }
    directionsRenderer.setMap(map);
    directionsService.route(request,function(result,status){
        if(status=="OK"){
          directionsRenderer.setDirections(result);
        }
    });

  }

var infoRows = [];
function getData(){
  var data = $.get(DEATHS_URL,function(){})
    .done(function(){
        //console.log(data.responseJSON.data[0]);
        var dataRow = data.responseJSON.data;
        for (var i = 0; i < dataRow.length; i++) {
          infoRows.push([dataRow[i][8],dataRow[i][13],dataRow[i][9]]);
        }
        //console.log(infoRows);
        var tableReference= $("#tableBody")[0]
        var newRow,state,deaths,year;
        for (var j = 0; j < infoRows.length; j++) {
          newRow = tableReference.insertRow(tableReference.rows.length);
          state = newRow.insertCell();
          deaths = newRow.insertCell();
          year = newRow.insertCell();
          state.innerHTML = infoRows[j][0];
          deaths.innerHTML = infoRows[j][1];
          year.innerHTML = infoRows[j][2];


        }
    })
    .fail(function(error){

        console.log(error);

    })
}

$("document").ready(function(){

  $("#getData").on("click",getData)
  $("#exportData").click(function(){

    $("table").tableToCSV();

});


})*/