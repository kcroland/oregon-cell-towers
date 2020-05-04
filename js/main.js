"use strict";
(function() {

  let mymap;
  let colors = chroma.scale('YlGnBu').colors(5);

  window.addEventListener("load", init);

  function init() {
    initMap();
    addAirports();
    addBounds();
    addLegend();
    L.control.scale({position: 'bottomleft'}).addTo(mymap);
  }

  function initMap() {
    mymap = L.map('map', {
        center: [39.82, -98.58],
        zoom: 5,
        maxZoom: 10,
        minZoom: 3,
        detectRetina: true});
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);
  }

  function addAirports() {
    let airports = null;

    airports = L.geoJson.ajax("assets/airports.geojson",{
      onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.AIRPT_NAME);
      },
      pointToLayer: function (feature, latlng) {
        let tower = "";
        if (feature.properties.CNTL_TWR === "Y" ? tower = "has-tower" : tower = "no-tower");
        return L.marker(latlng, {
          icon: L.divIcon({
            className: 'fa fa-plane icon ' + tower
          })
        });
      },
      attribution: 'Airport Data &copy; Data.gov | '
                 + 'State Boundaries &copy; Mike Bostock of D3 | '
                 + 'Base Map &copy; CartoDB | '
                 + 'Made By Kyle Roland'
    });

    airports.addTo(mymap);
  }

  function addBounds() {
    L.geoJson.ajax("assets/us-states.geojson").addTo(mymap);

    L.geoJson.ajax("assets/us-states.geojson", {
      // onEachFeature: function (feature, layer) {
      //   layer.bindPopup("Count = " + feature.properties.count.toString());
      // },
      style: style
    }).addTo(mymap);
  }

  function setColor(density) {
    let id = 0; // Default, density <= 8
    if (density > 59) { id = 4; }
    else if (density > 26 && density <= 59) { id = 3 }
    else if (density > 15 && density <= 26) { id = 2 }
    else if (density > 8 && density <= 15) { id = 1 }
    return colors[id];
  }

  function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
  }

  function addLegend() {
    let legend = L.control({
      position: 'bottomleft'
    });

    legend.onAdd = function () {
        // Create Div Element and Populate it with HTML
        let div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<b># Airports</b><br />';
        div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>59+</p>';
        div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>27-59</p>';
        div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>16-26</p>';
        div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p>8-15</p>';
        div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p>0-8</p>';
        div.innerHTML += '<hr><b>Airport<b><br />';
        div.innerHTML += '<i class="fa fa-plane icon has-tower"></i><p> Has ATC Tower</p>';
        div.innerHTML += '<i class="fa fa-plane icon no-tower"></i><p> No ATC Tower</p>';
        return div;
    };

    legend.addTo(mymap);
  }
})()
