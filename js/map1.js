mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    projection: {
        name: 'albers',
        parallels: [25, 50]
    },
    zoom: 3, // starting zoom
    center: [-102.5, 38] // starting center
});

const grades = [4, 5, 6],
    colors = ['rgb(208,209,230)', 'rgb(103,169,207)', 'rgb(1,108,89)'],
    radii = [5, 15, 20];



async function geojsonfetch(){
    let response = await fetch('assets/us-covid-2020/us-covid-2020-rates.geojson');
    let covid = await response.json();
    //load data to the map as new layers.
    //map.on('load', function loadingData() {
    map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function

        // when loading a geojson, there are two steps
        // add a source of the data and then add the layer out of the source
        map.addSource('covid-rate', {
            type: 'geojson',
            data: covid
        });

        map.addLayer({
            'id': 'covid-rate-fill',
            'type': 'fill',
            'source': 'covid-rate',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#FFEDA0', // stop_output_0
                    20, // stop_input_0
                    '#FED976', // stop_output_1
                    40, // stop_input_1
                    '#FEB24C', // stop_output_2
                    60, // stop_input_2
                    '#FD8D3C', // stop_output_3
                    80, // stop_input_3
                    '#FC4E2A', // stop_output_4
                    100, // stop_input_4
                    '#E31A1C', // stop_output_5
                    120, // stop_input_5
                    '#BD0026', // stop_output_6
                    140, // stop_input_6
                    "#800026" // stop_output_7
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });


        map.on('mousemove', ({point}) => {
               const state = map.queryRenderedFeatures(point, {
                   layers: ['covid-rate-fill']
               });
               document.getElementById('text-description').innerHTML = state.length ?
                   `<p>${state[0].properties.county} County, ${state[0].properties.state}</p><h3> </h3><p><strong><em></strong>Rate: ${state[0].properties.rates} cases per 1000 people</em></p>` :
                    `<p>Hover over a county!</p>`;
           });



           const layers = [
           '0-19',
           '20-39',
           '40-59',
           '60-79',
           '80-99',
           '100-119',
           '120-139',
           '140+'
       ];
       const colors = [
           '#FFEDA070',
           '#FED97670',
           '#FEB24C70',
           '#FD8D3C70',
           '#FC4E2A70',
           '#E31A1C70',
           '#BD002670',
           '#80002670'
       ];

       const legend = document.getElementById('legend');
       legend.innerHTML = "<b>COVID Case Rate<br>(cases / 1000 people)</b><br><br>";

       layers.forEach((layer, i) => {
           const color = colors[i];
           const item = document.createElement('div');
           const key = document.createElement('span');
           key.className = 'legend-key';
           key.style.backgroundColor = color;

           const value = document.createElement('span');
           value.innerHTML = `${layer}`;
           item.appendChild(key);
           item.appendChild(value);
           legend.appendChild(item);
       });

    });
};


geojsonfetch();
