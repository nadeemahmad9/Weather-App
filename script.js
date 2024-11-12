// DOM elements
let cityInput = document.getElementById("city_input"),
  searchBtn = document.getElementById("searchBtn"),
  locationBtn = document.getElementById("locationBtn"),
  api_key = "bdbb40a00c62e2e328c3b5da19f01bde",
  currentWeatherCard = document.querySelectorAll(".weather-left .card")[0],
  fiveDaysForecastCard = document.querySelector(".day-forecast"),
  aqiCard = document.querySelectorAll(".highlights .card")[0],
  sunriseCard = document.querySelectorAll(".highlights .card")[1],
  humidityVal = document.getElementById("humidityVal"),
  pressureVal = document.getElementById("pressureVal"),
  visibilityVal = document.getElementById("visibilityVal"),
  windSpeedVal = document.getElementById("windSpeedVal"),
  feelsVal = document.getElementById("feelsVal"),
  hourlyForecastCard = document.querySelector(".hourly-forecast"),
  aqiList = ["Good", "Fair", "Moderate", "Poor", "Very Poor"],
  tempUnit = "C"; // Default temperature unit
const cDegree = document.querySelector(".cDegree");
const fDegree = document.querySelector(".fDegree");

// Function to fetch and display weather details
function getWeatherDetails(name, lat, lon, country, state) {
  const Forecast_Api_Url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`; // Forecast API URL
  const Weather_Api_Url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`; // Current weather API URL
  const Air_Pollution_Api_Url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`; // Air pollution API URL

  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
  ]; // Days of the week for display
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]; // Months for display

  // Fetch air pollution data
  fetch(Air_Pollution_Api_Url)
    .then((res) => {
      if (!res.ok) throw new Error("Air Pollution data fetch failed"); // Handle errors
      return res.json();
    })
    .then((data) => {
      const { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components; // Extract air quality components
      aqiCard.innerHTML = ` <!-- Display AQI data --> 
        <div class="card-head">
          <p>Air Quality Index</p>
          <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
        </div>
        <div class="air-indices">
          <i class="fa fa-wind fa-3x"></i>
          <div class="item"><p>PM2.5</p><h3>${pm2_5}</h3></div>
          <div class="item"><p>PM10</p><h3>${pm10}</h3></div>
          <div class="item"><p>SO2</p><h3>${so2}</h3></div>
          <div class="item"><p>CO</p><h3>${co}</h3></div>
          <div class="item"><p>NO</p><h3>${no}</h3></div>
          <div class="item"><p>NO2</p><h3>${no2}</h3></div>
          <div class="item"><p>NH3</p><h3>${nh3}</h3></div>
          <div class="item"><p>O3</p><h3>${o3}</h3></div>
        </div>
      `;
    })
    .catch(() => alert("Error fetching air pollution data")); // Handle errors

  // Fetch current weather data
  fetch(Weather_Api_Url)
    .then((res) => {
      if (!res.ok) throw new Error("Weather data fetch failed"); // Handle errors
      return res.json();
    })
    .then((data) => {
      let date = new Date(); // Get current date
      const tempCelsius = data.main.temp - 273.15; // Convert temperature from Kelvin to Celsius
      const tempFahrenheit = (tempCelsius * 9) / 5 + 32; // Convert temperature from Celsius to Fahrenheit
      const displayedTemp =
        tempUnit === "C" ? Math.floor(tempCelsius) : Math.floor(tempFahrenheit); // Set the displayed temperature based on the selected unit

      currentWeatherCard.innerHTML = ` <!-- Display current weather -->
        <div class="current-weather">
          <div class="details">
            <p>Now</p>
            <h3>${displayedTemp}&deg;${tempUnit}</h3>
            <p>${data.weather[0].description}</p>
          </div>
          <div class="weather-icon">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
          </div>
        </div>
        <hr>
        <div class="card-footer">
          <p><i class="fa-solid fa-calendar"></i>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
          <p><i class="fa fa-location-dot"></i> ${name}, ${country}</p>
        </div>
      `;

      let { sunrise, sunset } = data.sys, // Get sunrise and sunset times
        { timezone, visibility } = data, // Get timezone and visibility data
        { humidity, pressure, feels_like } = data.main, // Get humidity, pressure, and "feels like" temperature
        { speed } = data.wind; // Get wind speed

      // Convert sunrise and sunset times to local timezone
      let sRiseTime = moment
          .utc(sunrise, "X")
          .add(timezone, "seconds")
          .format("hh:mm A"),
        sSetTime = moment
          .utc(sunset, "X")
          .add(timezone, "seconds")
          .format("hh:mm A");

      sunriseCard.innerHTML = ` <!-- Display sunrise and sunset times -->
        <div class="card-head">
          <p>Sunrise & Sunset</p>
        </div>
        <div class="sunrise-sunset">
          <div class="item">
            <div class="icon">
              <img src="./assets/sunrise.png" alt="">
            </div>
            <div>
              <p>Sunrise</p>
              <h3>${sRiseTime}</h3>
            </div>
          </div>
          <div class="item">
            <div class="icon">
              <img src="./assets/sunset.png" alt="">
            </div>
            <div>
              <p>Sunset</p>
              <h3>${sSetTime}</h3>
            </div>
          </div>
        </div>
      `;

      // Display additional weather information
      humidityVal.innerHTML = `${humidity}%`;
      pressureVal.innerHTML = `${pressure} hPa`;
      visibilityVal.innerHTML = `${(visibility / 1000).toFixed(2)} km`;
      windSpeedVal.innerHTML = `${speed} m/s`;
      feelsVal.innerHTML = `${
        tempUnit === "C"
          ? Math.floor(feels_like - 273.15)
          : Math.floor(((feels_like - 273.15) * 9) / 5 + 32)
      }&deg;${tempUnit}`;
    })
    .catch(() => alert("Error fetching weather data")); // Handle errors

  // Fetch forecast data
  fetch(Forecast_Api_Url)
    .then((res) => {
      if (!res.ok) throw new Error("Forecast data fetch failed"); // Handle errors
      return res.json();
    })
    .then((data) => {
      let hourlyForecast = data.list; // Get hourly forecast data
      hourlyForecastCard.innerHTML = ""; // Clear existing hourly forecast data

      // Loop through hourly forecast and display data for the next 8 hours
      for (let i = 0; i <= 7; i++) {
        let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
        let hr = hrForecastDate.getHours();
        let a = "PM";
        if (hr < 12) a = "AM"; // Determine AM/PM format
        if (hr === 0) hr = 12;
        if (hr > 12) hr = hr - 12;
        const hrTempCelsius = Math.floor(hourlyForecast[i].main.temp - 273.15); // Convert hourly temperature from Kelvin to Celsius
        const hrTempFahrenheit = Math.floor((hrTempCelsius * 9) / 5 + 32); // Convert hourly temperature from Celsius to Fahrenheit
        hourlyForecastCard.innerHTML += ` <!-- Display hourly forecast -->
          <div class="card">
            <p>${hr} ${a}</p>
            <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
            <p>${tempUnit === "C" ? hrTempCelsius : hrTempFahrenheit}&deg;${tempUnit}</p>
          </div>
        `;
      }

      let uniqueForecastDays = [];
      let fiveDaysForecast = data.list.filter((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          uniqueForecastDays.push(forecastDate);
          return true;
        }
        return false;
      });

      fiveDaysForecastCard.innerHTML = ""; // Clear existing 5-day forecast

      // Loop through and display 5-day forecast data
      for (let i = 1; i < fiveDaysForecast.length; i++) {
        let date = new Date(fiveDaysForecast[i].dt_txt);
        const tempCelsius = Math.floor(fiveDaysForecast[i].main.temp - 273.15); // Convert temperature from Kelvin to Celsius
        const tempFahrenheit = Math.floor((tempCelsius * 9) / 5 + 32); // Convert temperature from Celsius to Fahrenheit
        const displayedTemp = tempUnit === "C" ? tempCelsius : tempFahrenheit; // Determine which temperature unit to display
        fiveDaysForecastCard.innerHTML += ` <!-- Display 5-day forecast -->
          <div class="forecast-item">
            <div class="icon-wrapper">
              <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
            <span>${displayedTemp}&deg;${tempUnit}</span>
            </div>
            <p>${date.getDate()} ${months[date.getMonth()]}</p>
            <p>${days[date.getDay()]}</p>
          </div>
        `;
      }
    })
    .catch(() => alert("Failed to fetch weather forecast")); // Handle errors
}

// Function to get city coordinates based on input
function getCityCoordinates() {
  let cityName = cityInput.value.trim();
  cityInput.value = "";
  if (!cityName) return;
  const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`; // Geocoding API URL
  fetch(GEOCODING_API_URL)
    .then((res) => {
      if (!res.ok) throw new Error("Geocoding data fetch failed"); // Handle errors
      return res.json();
    })
    .then((data) => {
      if (data.length === 0) throw new Error("City not found"); // If no city found, show an alert
      let { name, lat, lon, country, state } = data[0]; // Extract city data
      localStorage.setItem("lastCity", JSON.stringify({ name, lat, lon, country, state })); // Store last city in localStorage
      getWeatherDetails(name, lat, lon, country, state); // Fetch weather details for the city
    })
    .catch(() => alert("City not found")); // Handle errors
}

// Function to get user's current coordinates
function getUserCoordinates() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let { latitude, longitude } = position.coords;
      let Reverse_geocoding_Url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`; // Reverse geocoding API URL
      fetch(Reverse_geocoding_Url)
        .then((res) => res.json())
        .then((data) => {
          let { name, country, state } = data[0]; // Extract city data
          localStorage.setItem(
            "lastCity",
            JSON.stringify({
              name,
              lat: latitude,
              lon: longitude,
              country,
              state,
            })
          );
          getWeatherDetails(name, latitude, longitude, country, state); // Fetch weather details for user's location
        })
        .catch(() => alert("Failed to fetch user location")); // Handle errors
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation permission denied. Please reset location permission to grant access again."
        ); // Alert if permission is denied
      }
    }
  );
}

// Function to load last searched city from localStorage
function loadLastCity() {
  const lastCity = JSON.parse(localStorage.getItem("lastCity"));
  if (lastCity) {
    getWeatherDetails(
      lastCity.name,
      lastCity.lat,
      lastCity.lon,
      lastCity.country,
      lastCity.state
    ); // Load weather details for last city
  }
}

// Function to toggle between Celsius and Fahrenheit
function toggleTemperatureUnit() {
  tempUnit = tempUnit === "C" ? "F" : "C"; // Toggle temperature unit
  loadLastCity(); // Reload weather with the new temperature unit
}

// Event listeners for buttons and inputs
searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click", getUserCoordinates);
cityInput.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getCityCoordinates() // Fetch city data when "Enter" key is pressed
);
cDegree.addEventListener("click", () => {
  fDegree.classList.remove("active");
  cDegree.classList.add("active");
  tempUnit = "C"; // Switch to Celsius
  loadLastCity();
}); // Add a button in HTML with id "tempToggle"
fDegree.addEventListener("click", () => {
  cDegree.classList.remove("active");
  fDegree.classList.add("active");
  tempUnit = "F"; // Switch to Fahrenheit
  loadLastCity();
});
window.addEventListener("load", loadLastCity); // Load last city data when the page loads
