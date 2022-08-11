mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A'

// lngLat for the NYC Oakland
var nycCenter = [-74.0060, 40.7128];

const bounds = [
    [-74.37, 40.5], // Southwest coordinates
    [-73.6, 41] // Northeast coordinates
];

// Months for the slider
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const map = new mapboxgl.Map({
  container: 'mapContainer', // HTML container id
  style: 'mapbox://styles/mapbox/dark-v9', // style URL
  center: nycCenter, // starting position as [lng, lat]
  zoom: 10,
  minZoom: 9,
  maxZoom: 15,
  maxBounds: bounds, // limit map bounds
});



function filterBy(year, month, tofilter) {

  const active = ['<=', 'active', tofilter];
  const installed = ['all', ['<=', 'installed', tofilter], ['>=', 'active', tofilter]];

  map.setFilter('bubble2', installed);
  map.setFilter('bubble', active);
  // Set the label to the month
  document.getElementById('month').textContent = months[month] + " " + year.toString();
}


// load the data
$.getJSON("data/2020_census_clean.geojson", function(censusData) {
$.getJSON("data/bubblemap.geojson", function(bubbleMap) {
$.getJSON("data/hhinc_spatial.json", function(hhinc) {


// load the data
var census =  censusData;
var bubblemap = bubbleMap;
var hhinc1 = hhinc;

bubblemap.features = bubblemap.features.map((d) => {
  var Month1 = (new Date(d.properties.installationDate).getMonth())/12;
  var Year1 = (new Date(d.properties.installationDate).getFullYear());

  var Month2 = (new Date(d.properties.activationDate).getMonth())/12;
  var Year2 = (new Date(d.properties.activationDate).getFullYear());

  d.properties.installed = Year1 + Month1;
  d.properties.active = Year2 + Month2;
  return d;
});

// console.log(bubblemap.features[2])


map.on('load', function() {
  map.addSource('census', {
    type: 'geojson',
    data: census,
  })
  map.addSource('bubbles', {
    type: 'geojson',
    data: bubblemap,
  })
  map.addSource('hhinc', {
    type: 'geojson',
    data: hhinc1,
  })


  map.addLayer({
    id: 'bubble',
    type: 'circle',
    source: 'bubbles',
    'layout': {
      visibility: 'visible', //Layers load invisible, to show only when toggled
    },

    paint: {

      'circle-radius': 5,
      'circle-opacity': 1.0,
      'circle-color': "green"
      }

    })

  map.addLayer({
    id: 'bubble2',
    type: 'circle',
    source: 'bubbles',
    'layout': {
      visibility: 'visible', //Layers load invisible, to show only when toggled
    },

    paint: {

      'circle-radius': 5,
      'circle-opacity': 0.6,
      'circle-color': "orange"
      }

    })
    filterBy(2016, 0, 2016);

    document.getElementById('slider').addEventListener('input', (e) => {
    const year = parseInt(e.target.value, 10);
    const month = (((parseFloat(e.target.value)%1)*12).toFixed());
    const tofilter = parseFloat(e.target.value);
    // console.log(e.target.value);
    filterBy(year, month, tofilter);
    });

    console.log(hhinc1)
    // // add percentage white layer
    //   map.addLayer({
    //     id: 'hhinc',
    //     type: 'fill',
    //     source: 'hhinc',
    //     'layout': {
    //       visibility: 'visible', //Layers load invisible, to show only when toggled
    //     },
    //     paint: {
    //       'fill-color': [
    //         'interpolate',
    //         ['linear'],
    //         ['get', 'hhinc'],
    //         0,
    //         '#921717',
    //         1000,
    //         '#925617',
    //         30000,
    //         '#a8991a',
    //         60000,
    //         '#89a81a',
    //         90000,
    //         '#57a81a',
    //         120000,
    //         '#0c4b1f',
    //       ],
    //       'fill-opacity': 0.5
    //     }
    //   })

    // add percentage white layer
      map.addLayer({
        id: 'whitep',
        type: 'fill',
        source: 'census',
        'layout': {
          visibility: 'none', //Layers load invisible, to show only when toggled
        },
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'WNH_20P'],
            0,
            '#f6e2ff',
            20,
            '#edc4ff',
            40,
            '#e19dff',
            60,
            '#d26dff',
            80,
            '#c543ff',
            90,
            '#9b00e1',
          ],
          'fill-opacity': 0.7
        }
      })

    // add percentage black layer
      map.addLayer({
        id: 'blackp',
        type: 'fill',
        source: 'census',
        'layout': {
          visibility: 'none', //Layers load invisible, to show only when toggled
        },
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'BNH_20P'],
            0,
            '#f6e2ff',
            20,
            '#edc4ff',
            40,
            '#e19dff',
            60,
            '#d26dff',
            80,
            '#c543ff',
            90,
            '#9b00e1',
          ],
          'fill-opacity': 0.7
        }
      })

    // add percentage asian layer
      map.addLayer({
        id: 'asianp',
        type: 'fill',
        source: 'census',
        'layout': {
          visibility: 'none', //Layers load invisible, to show only when toggled
        },
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'ANH_20P'],
            0,
            '#f6e2ff',
            20,
            '#edc4ff',
            40,
            '#e19dff',
            60,
            '#d26dff',
            80,
            '#c543ff',
            90,
            '#9b00e1',
          ],
          'fill-opacity': 0.7
        }
      })

    // add percentage white change layer
      map.addLayer({
        id: 'whitec',
        type: 'fill',
        source: 'census',
        'layout': {
          visibility: 'none', //Layers load invisible, to show only when toggled
        },
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'WNH_PCh'],
            -50,
            '#ff2d00',
            -25,
            '#ff8f77',
            0,
            '#ffffff',
            25,
            '#8183ff',
            50,
            '#0004ff',
          ],
          'fill-opacity': 0.7
        }
      })

    // add percentage black change layer
      map.addLayer({
        id: 'blackc',
        type: 'fill',
        source: 'census',
        'layout': {
          visibility: 'none', //Layers load invisible, to show only when toggled
        },
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'BNH_PCh'],
            -50,
            '#ff2d00',
            -25,
            '#ff8f77',
            0,
            '#ffffff',
            25,
            '#8183ff',
            50,
            '#0004ff',

          ],
          'fill-opacity': 0.7
        }
      })

    // // Enumerate ids of the layers.
    // const toggleableLayerIds = ['hhinc'];
    //
    // // Set up the corresponding toggle button for each layer.
    // for (const id of toggleableLayerIds) {
    // // Skip layers that already have a button set up.
    // if (document.getElementById(id)) {
    // continue;
    // }
    //
    // // Create a link.
    // const link = document.createElement('a');
    // link.id = id;
    // link.href = '#';
    // link.textContent = id;
    // link.className = 'active';
    //
    // // Show or hide layer when the toggle is clicked.
    // link.onclick = function (e) {
    // const clickedLayer = this.textContent;
    // e.preventDefault();
    // e.stopPropagation();
    //
    // const visibility = map.getLayoutProperty(
    // clickedLayer,
    // 'visibility'
    // );
    //
    // // Toggle layer visibility by changing the layout object's visibility property.
    // if (visibility === 'visible') {
    // map.setLayoutProperty(clickedLayer, 'visibility', 'none');
    // this.className = '';
    // } else {
    // this.className = 'active';
    // map.setLayoutProperty(
    // clickedLayer,
    // 'visibility',
    // 'visible'
    // );
    // }
    // };
    //
    // const layers = document.getElementById('menu');
    // layers.appendChild(link);
    // }



// Buttons to toggle the visibility of the layers
    $('#white-percentage').on('click', function() {
      // when this is clicked, let's fly the map to Midtown Manhattan
        map.setLayoutProperty('whitep', 'visibility', 'visible');
        map.setLayoutProperty('blackp', 'visibility', 'none');
        map.setLayoutProperty('asianp', 'visibility', 'none');
        map.setLayoutProperty('whitec', 'visibility', 'none');
        map.setLayoutProperty('blackc', 'visibility', 'none');

    })
    $('#black-percentage').on('click', function() {
      // when this is clicked, let's fly the map to Midtown Manhattan
      map.setLayoutProperty('whitep', 'visibility', 'none');
      map.setLayoutProperty('blackp', 'visibility', 'visible');
      map.setLayoutProperty('asianp', 'visibility', 'none');
      map.setLayoutProperty('whitec', 'visibility', 'none');
      map.setLayoutProperty('blackc', 'visibility', 'none');

    })

    $('#asian-percentage').on('click', function() {
    // when this is clicked, let's fly the map to Midtown Manhattan
      map.setLayoutProperty('whitep', 'visibility', 'none');
      map.setLayoutProperty('blackp', 'visibility', 'none');
      map.setLayoutProperty('asianp', 'visibility', 'visible');
      map.setLayoutProperty('whitec', 'visibility', 'none');
      map.setLayoutProperty('blackc', 'visibility', 'none');

    })

    $('#white-change').on('click', function() {
    // when this is clicked, let's fly the map to Midtown Manhattan
      map.setLayoutProperty('whitep', 'visibility', 'none');
      map.setLayoutProperty('blackp', 'visibility', 'none');
      map.setLayoutProperty('asianp', 'visibility', 'none');
      map.setLayoutProperty('whitec', 'visibility', 'visible');
      map.setLayoutProperty('blackc', 'visibility', 'none');

    })

    $('#black-change').on('click', function() {
    // when this is clicked, let's fly the map to Midtown Manhattan
      map.setLayoutProperty('whitep', 'visibility', 'none');
      map.setLayoutProperty('blackp', 'visibility', 'none');
      map.setLayoutProperty('asianp', 'visibility', 'none');
      map.setLayoutProperty('whitec', 'visibility', 'none');
      map.setLayoutProperty('blackc', 'visibility', 'visible');

    })


})
})
})
})
