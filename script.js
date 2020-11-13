const urlGeolocate = `https://www.googleapis.com/geolocation/v1/geolocate?key=${Keys.googleApi}`;
const urlGeocode = 'https://maps.googleapis.com/maps/api/geocode/json';
const weatherURL = 'https://api.openweathermap.org/data/2.5/weather';

async function getPlaceName() {
    const coordinates = await fetch(urlGeolocate, {method: 'POST'})
        .then(res => res.json());

    const location = await fetch(`${urlGeocode}?latlng=${coordinates.location.lat},${coordinates.location.lng}&key=${Keys.googleApi}`)
             .then(res => res.json())

    const city = location.results[0].address_components[2].long_name;
    const country = location.results[0].address_components[5].long_name

    return `${city}, ${country}`;
}

async function appendPlaceName() {
    const place = await getPlaceName();
    document.getElementById("current_city").append(place);
}

async function getWeatherResults(place) {
    let temperature = await fetch(`${weatherURL}?q=${place}&appid=${Keys.weatherApiKey}`, {
        method: 'POST',
        body: JSON.stringify({ id: 200 })
    })
        .then(res => res.json());
        
    document.getElementById("current_temperature").append(Math.floor(temperature.main.temp - 273) + " °C")
    document.getElementById('icon').className = chooseWeatherIcon(temperature.weather[0].main)
}

async function fetchTemperature() {
    let placeName = await getPlaceName()
    getWeatherResults(placeName.split(',')[0])
}

const chooseWeatherIcon = (weather) => {
    switch (weather) {
        case 'Clouds':
            return 'wi wi-day-cloudy'
        case 'Clear':
            return 'wi wi-day-sunny'
        case 'Thunderstorm':
            return 'wi wi-day-thunderstorm'
        case 'Drizzle':
            return 'wi wi-day-sleet'
        case 'Rain':
            return 'wi wi-day-rain'
        case 'Snow':
            return 'wi wi-day-snow'
        case 'Atmosphere':
            return 'wi wi-day-fog'
    }

}

appendPlaceName()
fetchTemperature()
