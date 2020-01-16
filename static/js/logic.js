// Challenge 1 - Basic Visualization
// Step 1: Import Data from USGS GeoJson Feed (All Eartquakes in Past Week)

const API_KEY = "pk.eyJ1IjoicGphaXNpbmdoYW5pIiwiYSI6ImNrMnBlbXczZTAzaTAzY3BnZ3BjcnA0MjYifQ.cR4ZtT0s7z6RSCfsl2vTMg";

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Step 2: Query geoURL to obatain data

d3.json(queryURL, function(data){
    // Print to console for debugging
    console.log(queryURL)
    // Send data to createFeatures function 
    createFeatures(data.features);
});

// Step 3: Create Map

function createFeatures(earthquakeData) {
    var geoMap= L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
      })

    var darkMode = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 15,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });

    // Plot points
    var plotArray = new Array();
    for (var i = 0; i < earthquakeData.length; i++) {
        coordinates = [earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]]
        properties = earthquakeData[i].properties;

        // Conditional formatting based on earthquake magnitude 
        var markerColor = "#FD8D3C";
        if (properties.mag < 1) {
            markerColor = "#FD8D3C";
        }
        else if (properties.mag < 2) {
            markerColor = "#FC4E2A";
        }
        else if (properties.mag < 3) {
            markerColor = "#E31A1C";
        }
        else if (properties.mag < 4) {
            markerColor = "#F8C9A0";
        }
        else if (properties.mag < 5) {
            markerColor = "#800026";
        }

        // Format plot circle properties
        var markers = L.circle(coordinates, {
            fillOpacity: 0.90,
            color: markerColor,
            fillColor: markerColor,
            radius: (properties.mag * 22000)
        }).bindPopup("<h4>" + properties.place + "</h4> <hr> <h4>Magnitude: " + properties.mag.toFixed(2) + "</h4>");

        // Push formatting to plots
        plotArray.push(markers);
    }

    // Configure Layers
    var earthquakes = L.layerGroup(plotArray);

    var baseMaps = {
        "Outdoors Map": geoMap,
        "Satellite Map": darkMode
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };
    
    // The map itself
    var Map = L.map("map", {
        center: [39.82, -90.57],
        zoom: 3.5,
        layers: [geoMap, earthquakes],
        legend: true
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(Map);

    // Step 5: Create & configure map legend

    var legend = L.control({position: 'bottomright'});

    function getColor(d) {
        return  d > 5 ? '#800026' :
               d > 4  ? '#BD0026' :
               d > 3  ? '#E31A1C' :
               d > 2  ? '#FC4E2A' :
            d > 1 ? '#FD8D3C' : '#FD8D3C';
    }


    legend.onAdd = function (Map) {
        var div = L.DomUtil.create('div', 'info legend');
        bins = [0, 1, 2, 3, 4, 5],
        labels = [];
        

        for (var i = 0; i < bins.length; i++) {
            div.innerHTML += 
                '<i style="background:' + getColor(bins[i] + 1) + '"></i>' + 
                bins[i] + (bins[i + 1] ? '&ndash;' + bins[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(Map)
};