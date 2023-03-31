function getWeather(city) {
    const apiKey = '4d86196762f653af22c042bcfd933d47';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // parse response data and update weather display
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }
  