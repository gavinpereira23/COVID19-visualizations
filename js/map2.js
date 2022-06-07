mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 4, // starting zoom,
    projection: {
        name: 'albers',
        parallels: [25, 50]
    },
    center: [-102.5, 38] // starting center
});

const grades = [10, 100, 1000, 10000, 50000],
    colors = ['#fff4db', '#ffd780', '#ff9940', '#ff6040', '#ff0011'],
    radii = [2, 5, 7, 11, 16];

//load data to the map as new layers.
//map.on('load', function loadingData() {
map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function

    // when loading a geojson, there are two steps
    // add a source of the data and then add the layer out of the source
    map.addSource('covid-counts', {
        type: 'geojson',
        data: 'assets/us-covid-2020/us-covid-2020-counts.geojson'
    });

    map.addLayer({
            'id': 'covid-counts-point',
            'type': 'circle',
            'source': 'covid-counts',
            'minzoom': 4,
            'paint': {
                // increase the radii of the circle as the zoom level and dbh value increases
                'circle-radius': {
                    'property': 'cases',
                    'stops': [
                        [{
                            zoom: 5,
                            value: grades[0]
                        }, radii[0]],
                        [{
                            zoom: 5,
                            value: grades[1]
                        }, radii[1]],
                        [{
                            zoom: 5,
                            value: grades[2]
                        }, radii[2]],
                        [{
                            zoom: 5,
                            value: grades[3]
                        }, radii[3]],
                        [{
                            zoom: 5,
                            value: grades[4]
                        }, radii[4]]
                    ]
                },
                'circle-color': {
                    'property': 'cases',
                    'stops': [
                        [grades[0], colors[0]],
                        [grades[1], colors[1]],
                        [grades[2], colors[2]],
                        [grades[3], colors[3]],
                        [grades[4], colors[4]]
                    ]
                },
                'circle-stroke-color': 'black',
                'circle-stroke-width': 1,
                'circle-opacity': 0.6
            }
        },
        'waterway-label'
    );


    // click on tree to view magnitude in a popup
    map.on('click', 'covid-counts-point', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<b>${event.features[0].properties.county} County</b><br><strong>Deaths:</strong> ${event.features[0].properties.cases}`)
            .addTo(map);
    });

});


// create legend
const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<strong>Covid-19 Cases</strong>'],
    vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    // you need to manually adjust the radius of each dot on the legend
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');

}
// add the data source
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href=https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NYT</a></p>';
// combine all the html codes.
legend.innerHTML = labels.join('') + source;
