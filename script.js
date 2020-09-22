let urlGeolocate = `https://www.googleapis.com/geolocation/v1/geolocate?key=${Keys.googleApi}`;

async function getPlaceName() {
    let array = [];
    await fetch(urlGeolocate, {
        method: 'POST'
    }).then(response => { if (response.ok) { return response.json(); } }).then(async jsonResponse => {
            await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${jsonResponse.location.lat},${jsonResponse.location.lng}&key=${Keys.googleApi}`)
                .then(response => { if (response.ok) { return response.json() } })
                .then(jsonResponse => array.push(jsonResponse))
        })

    return array
}

async function fetchPlace() {
    let result = await getPlaceName()
    document.getElementById("current_city").append(result[0].results[0].address_components[2].long_name + ', ')
    document.getElementById("current_city").append(result[0].results[0].address_components[5].long_name)
}

async function getWeatherResults(place) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${Keys.weatherApiKey}`, {
        method: 'POST',
        body: JSON.stringify({ id: 200 })
    })

    let jsonResponse = await response.json()
    document.getElementById("current_temperature").append(Math.floor(jsonResponse.main.temp - 273) + " °C")
    document.getElementById('icon').className = chooseWeatherIcon(jsonResponse.weather[0].main)
}

async function fetchTemperature() {
    let placeName = await getPlaceName()
    getWeatherResults(placeName[0].results[0].address_components[2].long_name)
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

fetchPlace()
fetchTemperature()
