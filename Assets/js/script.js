let cityInputEl = document.querySelector("#cityInput");
let searchForm = document.querySelector("#searchForm");
let clearBtn = document.querySelector("#clearHistBtn");
let pastSearchedCitiesEl = document.querySelector("#searchHistory");
let presentDayWeather = document.querySelector("#currentWeather");
let fiveDayForecast = document.querySelector("#five-day-forecast");
let searchHistory = [];

// Display dashboard function
function dashboard(event) {
    event.preventDefault();
    let cityName = cityInputEl.value;
    displayWeather(cityName);
}

// Declare API Key, prefered units output and language from OpenWeather
const apiKey = "559a901ce8fe83f4462c290f516fd7bc";
const lang = 'en';
const units = 'metric';

// Column 2: Weather information display
function displayWeather(cityName) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (currentData) {
            console.log(currentData);
            let oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${apiKey}&units=${units}&lang=${lang}`;
            fetch(oneCallUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (fiveDayData) {
                    if (searchHistory.includes(currentData.name) === false) {
                        searchHistory.push(currentData.name);
                        localStorage.setItem("city", JSON.stringify(searchHistory));
                    }
                    displayCity();
                    console.log(fiveDayData);

                    // Present today's date, weather icon condition, temperature, wind speed and humidity
                    presentDayWeather.innerHTML = `<ul>
        <li class="title">${currentData.name} /<span> ${moment(
                        currentData.dt,
                        "X"
                    ).format("DD/MM/YYYY")} </span></li>
        <li><img src ="http://openweathermap.org/img/wn/${currentData.weather[0].icon
                        }@2x.png" /></li>
        <li>Temp/°C: ${(currentData.main.temp)}</li>
        <li>Wind/mps: ${currentData.wind.speed}</li>
        <li>Humidity/%: ${currentData.main.humidity}</li>
    </ul>
        `;

                    // Present the next 5 days date, weather icon condition, temperature, wind speed and humidity
                    let cards = "";
                    for (let i = 1; i < 6; i++) {
                        cards =
                            cards +
                            `<ul class="col-12 col-xl-2 dayCard">
        <li>${moment(fiveDayData.daily[i].dt, "X").format(" DD/MM/YYYY")}</li>
        <li><img src ="http://openweathermap.org/img/wn/${fiveDayData.daily[i].weather[0].icon
                            }@2x.png" /></li>
        <li>Temp/°C: ${(fiveDayData.daily[i].temp.day)}</li>
        <li>Wind/mps: ${fiveDayData.daily[i].wind_speed}</li>
        <li>Humidity/%: ${fiveDayData.daily[i].humidity}</li>
    </ul>`;
                    }
                    fiveDayForecast.innerHTML = cards;
                });
        });
}

// Display the searched cities history as buttons that can be clicked to get the weather information
function displayCity() {
    if (localStorage.getItem("city")) {
        searchHistory = JSON.parse(localStorage.getItem("city"));
    }
    let cityList = "";
    for (let i = 0; i < searchHistory.length; i++) {
        cityList =
            cityList +
            `<button class="btn btn-secondary my-2" type="submit">${searchHistory[i]}</button>`;
    }
    pastSearchedCitiesEl.innerHTML = cityList;
    let myDashTwo = document.querySelectorAll(".my-2");
    for (let i = 0; i < myDashTwo.length; i++) {
        myDashTwo[i].addEventListener("click", function () {
            displayWeather(this.textContent);
        });
    }
}
displayCity();

searchForm.addEventListener("submit", dashboard); 


// Clear the Search History display and local storage when "Clear History" button is clicked
function clearSearchHistory() {
    localStorage.clear();
    pastSearchedCitiesEl.innerHTML = "";
    searchHistory = [];
}
clearBtn.addEventListener("click", function () {
    clearSearchHistory();
});
