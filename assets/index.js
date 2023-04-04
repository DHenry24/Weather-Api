const apiKey = '8cadd96d6dde74b94f7471d1ffcb1d3a';

const form = document.querySelector('form');
const cityInput = document.querySelector('#city');
const currentWeatherDiv = document.querySelector('#current-weather');
const forecastDiv = document.querySelector('#forecast');
const searchHistoryDiv = document.querySelector('#search-history');

let searchHistory = [];

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = cityInput.value;
    getWeather(city);
});

function getWeather(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            const currentWeatherData = data[0];
            const forecastData = data[1];
            displayCurrentWeather(currentWeatherData);
            displayForecast(forecastData);
            addToSearchHistory(city);
        })
        .catch(error => console.log(error));
}

function displayCurrentWeather(data) {
    const cityName = data.name;
    const date = new Date().toLocaleDateString();
    const iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const currentWeatherHtml = `
        <h2>${cityName} - ${date}</h2>
        <img src="${iconUrl}" alt="${data.weather[0].description}">
        <p>Temperature: ${temperature} &#8451;</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;

    currentWeatherDiv.innerHTML = currentWeatherHtml;
}

function displayForecast(data) {
    let i = 0;
    const forecastHtml = data.list.reduce((html, item) => {
      const date = new Date(item.dt_txt).toLocaleDateString();
      const iconUrl = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;
      const temperature = item.main.temp;
      const humidity = item.main.humidity;
      const windSpeed = item.wind.speed;
      const dateExists = html.some((item) => item.date === date);
      if (!dateExists) {
        html.push({
          date: date,
          iconUrl: iconUrl,
          temperature: temperature,
          humidity: humidity,
          windSpeed: windSpeed
        });
      }
      return html;
    }, []);
  
    const forecastHtmlString = forecastHtml.map((item) => {
      const date = item.date;
      const iconUrl = item.iconUrl;
      const temperature = item.temperature;
      const humidity = item.humidity;
      const windSpeed = item.windSpeed;
      return `
        <div>
          <h3>${date}</h3>
          <img src="${iconUrl}" alt="${item.description}">
          <p>Temperature: ${temperature} &#8451;</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
        </div>
      `;
    }).join('');
  
    document.getElementById('forecast').innerHTML = forecastHtmlString;
  }

function addToSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        const searchHistoryHtml = searchHistory.map(city => `<button>${city}</button>`).join('');
        searchHistoryDiv.innerHTML = searchHistoryHtml;
    }
}
