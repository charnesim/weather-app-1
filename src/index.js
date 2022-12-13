function getADay() {
  //This function gets the current day
  let currentDate = new Date();
  let day = currentDate.getDay();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  let displayDate = days[day];

  //console.log(displayDate)
  return displayDate;
}

function getTheTime() {
  //This function gets the current time
  let currentTime = new Date();
  let hour = currentTime.getHours();
  let minutes = currentTime.getMinutes();

  if (hour < "10") {
    hour = `0${hour}`;
  }

  if (minutes < "10") {
    minutes = `0${minutes}`;
  }

  let completeTime = `${hour}:${minutes}`;

  //  console.log(completeTime);
  return completeTime;
}

function dateAndTime() {
  //places date on the weather app
  let placeDate = document.querySelector("#date");
  placeDate.innerHTML = getADay();

  //places time on the weather app
  let placeTime = document.querySelector("#time");
  placeTime.innerHTML = getTheTime();
}

dateAndTime();

//selects serach bar, and listens for submit
let searchBar = document.querySelector("#search");
searchBar.addEventListener("submit", displayCity);

//selects the city element and injects data from search bar to city element
function displayCity(event) {
  event.preventDefault();
  let inputSearch = document.querySelector("#searchbox-input");
  let city = document.querySelector("#city");
  city.innerHTML = inputSearch.value;

  let apiKey = "2b6fdad0cbd018949c50c70f72250726";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputSearch.value}&appid=${apiKey}&units=metric`;

  //takes weather from api call an injects into app
  function displayWeather(response) {
    console.log(response.data);
    let weather = Math.round(response.data.main.temp);

    let largeDegree = document.querySelector("#degrees");
    largeDegree.innerHTML = weather;

    let weatherIcon = document.querySelector("#weather-emoji");
    weatherIcon.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    weatherIcon.setAttribute("alt", response.data.weather[0].description);

    let windElement = document.querySelector("#wind-speed");
    windElement.innerHTML = Math.round(response.data.wind.speed);

    let descriptionElement = document.querySelector("#weather-description");
    descriptionElement.innerHTML = response.data.weather[0].description;

    getForecast(response.data.coord);
    //console.log(response.data.coord);

    appInfo(response);
  }

  axios.get(apiUrl).then(displayWeather);
}

//calls geolocation, and get longitude and latitude
function getLocation() {
  navigator.geolocation.getCurrentPosition(displayLocation);

  //put longitude and latitude in weather api call
  function displayLocation(position) {
    //console.log(response);
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    //get longtitude and latitude api response, and inject city and weather to weather app
    function changeCurrentCityDegree(response) {
      //console.log(response);
      let temp = response.data.main.temp;

      let largeDegree = document.querySelector("#degrees");
      largeDegree.innerHTML = Math.round(temp);

      let cityName = document.querySelector("#city");
      cityName.innerHTML = response.data.name;
      console.log(cityName);
    }

    //api call for longitude and latitude
    let apiKey = "2b6fdad0cbd018949c50c70f72250726";
    let apiLatLonUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiLatLonUrl).then(changeCurrentCityDegree);
  }
}

//selects current weather button
let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getLocation);

//selects the fahrenheit link, and listens for click to execute function
let changeFahrenheit = document.querySelector("#fahrenheit-link");
changeFahrenheit.addEventListener("click", convertFahrenheit);

//takes current degree in fahrenheit and injects it as the large degree
function convertFahrenheit(event) {
  let currentDegree = "55";
  event.preventDefault();
  let degrees = document.querySelector("#degrees");
  degrees.innerHTML = currentDegree + "°";
  return currentDegree;
}

//selects celsius link and listens for click to execute function
let changeCelsius = document.querySelector("#celsius-link");
changeCelsius.addEventListener("click", convertCelsius);

//selects large degree and injects it with a conversion from the fahrenheit function to celsius
function convertCelsius(event) {
  event.preventDefault();
  let degrees = document.querySelector("#degrees");
  let fahrenheitDegree = convertFahrenheit(event);
  degrees.innerHTML = Math.round(((fahrenheitDegree - 32) * 5) / 9) + "°";
}

function dailyForecast(response) {
  // console.log(response.data);
  let forecastDay = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let days = ["Mon", "Tues", "Wed", "Thurs"];

  let forecastHTML = `<div class="row">`;
  days.forEach(function (forecastDay) {
    forecastHTML =
      forecastHTML +
      `
      <div class="col-2">
        <div class="weather-forecast-date">${forecast.dt}</div>
        <img
          src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${forecastDay.temp.max}° </span>
          <span class="weather-forecast-temperature-min"> ${forecastDay.temp.min}° </span>
        </div>
      </div>
  `;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  console.log(forecastHTML);
}

//dailyForecast();

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "2b6fdad0cbd018949c50c70f72250726";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(dailyForecast);
}

//function appInfo(response) {}

//axios.get(apiUrl).then(appInfo);
