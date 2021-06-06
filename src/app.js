
    function formatDate(timestamp) {
    
        let now = new Date(timestamp); 
    
        let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let day = days[now.getDay()];

        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let month = months[now.getMonth()];

        let hours = now.getHours();

            if (hours < 10) {
                hours = `0${hours}`; 
            } 

        let minutes = now.getMinutes(); 
        
            if (minutes < 10) {
                minutes = `0${minutes}`; 
            }

        //could alternatively do: 
        //let minutes = ('0' + now.getMinutes()).slice(-2);

    let todayTime = document.querySelector("#today-time");
    todayTime.innerHTML = `Last updated - ${day} ${hours}:${minutes}`;

    }


    function formatDt(timestamp) {
        let date = new Date(timestamp * 1000);
        let day = date.getDay();
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 

        return days[day];
    }

//so just need HTML and CSS for one row of weather forecast ('day 2') and rest is repeated by JS 

    function displayForecast(response) {
        let forecast = response.data.daily;

        let forecastElement = document.querySelector("#forecast"); 
        
        let forecastHTML = ``; 

        forecast.forEach(function (forecastDay, index) {
            if (index < 5) {
            forecastHTML = forecastHTML + 
            `<p>           
                <div class="row">
                    <div class="col-5">
                        <li class="forecast-date">
                            ${formatDt(forecastDay.dt)}: 
                        </li>
                    </div>
                    <div class="col-1">
                        <img 
                            src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" 
                            alt="..." 
                            class="forecast-emoji" 
                            width="45px"
                        >
                    </div>
                    <div class="col-4"> 
                        <li class="forecast-temp">
                            ${Math.round(forecastDay.temp.max)}° 
                            <span class="temp-low">(${Math.round(forecastDay.temp.min)}°)</span>
                        </li>
                    </div>
                </div>
            </p>
            `;
            }
        });
 
        forecastElement.innerHTML = forecastHTML; 
        

    }


    function getForecast(coordinates) {
        //console.log(coordinates); 
            //we know we're receiving 'response.data.coord' from where this function is called below 
            // (within 'displayTemperature' function)
            //so we call it 'coordinates' to help us understand what is being received 

        let apiKey = "df0e4203de8f0cf1987569b54e21756c"; 
        let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
        axios.get(apiUrl).then(displayForecast); 
            //calls the function which is defined above 
    }

    function displayTemperature(response) {

        //just so we can see what we're working with: 
        //console.log(response); 
        //console.log(response.data.name); //this gives us the name of the city 
        //console.log(response.data.main.temp); //this gives us the temperature 
        //console.log(response.data.weather[0].main); //this gives us the description of the weather (e.g. sunny, clouds) 
        //console.log(response.data.coord); //this gives the coordinates of the city 

        //now we want to change the name of the city within the h1 heading (id="city-name") 
        //can target the name of the city and call it 'cityName'... and do the rest for the other elements 
        let cityElement = document.querySelector("#city-name"); 
        let temperatureElement = document.querySelector("#temp-today");        
        let descriptionElement = document.querySelector("#description"); 
        //weather API has built-in icons: https://openweathermap.org/weather-conditions 
        //URL: https://openweathermap.org/img/wn/10d@2x.png 
        let emojiElement = document.querySelector("#emoji"); 

        celsiusTemperature = response.data.main.temp; 

        //and now we can replace the inner HTML of each of them 
        cityElement.innerHTML = response.data.name; 
        temperatureElement.innerHTML = Math.round(celsiusTemperature);
        descriptionElement.innerHTML = response.data.weather[0].main; 
        emojiElement.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
        emojiElement.setAttribute("alt", response.data.weather[0].main); 
        //could be more efficient by doing 'document.querySelector("#city-name").innerHTML' etc 
            //i.e. don't need to make a new variable 'cityName' (this would save 2 lines of code per 1 element) 
            //but keeping it as is just to make it clear for me 
            //also, instead of 'response.data.name', could just used the 'cityInput' variable set below 
                //but this cleans it up as it gets the city name straight from the API


        //-------------------- conditional background --------------------

        //to change background according to weather description: 
        let imageDescription = response.data.weather[0].main; 
        if (imageDescription == "Clear" || 
            imageDescription == "Clouds" || 
            imageDescription == "Thunderstorm" || 
            imageDescription == "Drizzle" || 
            imageDescription == "Rain" || 
            imageDescription == "Snow") {
            
            document.getElementById('app-bg').style.backgroundImage=`url(assets/${imageDescription}.png)`; 
            } 
        
        let iconWeather = response.data.weather[0].icon; 

        //if clear night 
        if (iconWeather == "01n") {
            document.getElementById('app-bg').style.backgroundImage=`url(assets/clear-night.png)`; 
        }

        //if night and other weather than clear 
        if (iconWeather == "02n" ||
            iconWeather == "03n" ||
            iconWeather == "04n" ||
            iconWeather == "09n" ||
            iconWeather == "10n" ||
            iconWeather == "11n" ||
            iconWeather == "13n" ||
            iconWeather == "50n") {
            document.getElementById('app-bg').style.backgroundImage=`url(assets/cloudy-night2.png)`; 
        }

        //-------------------- end conditional background --------------------

        dateToday = formatDate(response.data.dt * 1000)

        getForecast(response.data.coord); 
            //this sends the function 'getForecast' with the coordinates of the city 
            //see above for when this function is defined (defined above; called here)

            
    }


    function searchCity(city) {
        let apiKey = "df0e4203de8f0cf1987569b54e21756c"; 
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`; 

        axios.get(apiUrl).then(displayTemperature); 
    }


    function handleSubmit(event) {
        event.preventDefault(); 

        let city = document.querySelector("#search-bar").value; 
            //remember '#search-bar' is the ID of the 'input' (search bar) (rather than form)
            //so this means 'let city = the value that's searched' 
        let apiKey = "df0e4203de8f0cf1987569b54e21756c"; 
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`; 

        searchCity(city); 
    } 

    function searchLocation(position) {
        let apiKey = "df0e4203de8f0cf1987569b54e21756c"; 
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${apiKey}`;  
            //this function is called from within the 'getCurrentLocation' function - i.e. when press button 
        axios.get(apiUrl).then(displayTemperature); 
    } 

    function getCurrentLocation(event) {
        event.preventDefault();
        //now make new API call to get weather info for current co-ordinates 
        navigator.geolocation.getCurrentPosition(searchLocation);  
            //now make function called 'getCurrentPosition' - do this above 
    }


//-------------------- temperature conversion --------------------- 

// (2) temperature conversion function (receives an event, so (event))
function displayFahrenheitTemperature(event) {
    event.preventDefault(); 
        //prevents default behaviour which is to open a new page 
    //now we need to replace the inner HTML of the celsius temp on the page 
    let temperatureElement = document.querySelector("#temp-today"); 
    
    //remove the active class from the C link, add to F link: 
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active"); 
    
    //and new variable which is the result of the formula (C to F):  
    let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;  
    temperatureElement.innerHTML = Math.round(fahrenheitTemperature); 
}

// (5) celsius conversion function 
function displayCelsiusTemperature(event) {
    event.preventDefault(); 
    let temperatureElement = document.querySelector("#temp-today"); 
    
    //add the active class to the C link, remove from F link: 
    celsiusLink.classList.add("active"); 
    fahrenheitLink.classList.remove("active");  

    temperatureElement.innerHTML = Math.round(celsiusTemperature); 
}

// (3) need global variables rather than just ones within functions 
let celsiusTemperature = null; 
    //set to nothing by default 
    //then go into 'displayTemperature' function 

let form = document.querySelector("#city-search-form"); //remember this is the ID of the form 
form.addEventListener("submit", handleSubmit); 


// (1) start by doing this 
let fahrenheitLink = document.querySelector("#fahrenheit-link"); 
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature); 

// (4) do the same for celsius 
let celsiusLink = document.querySelector("#celsius-link"); 
celsiusLink.addEventListener("click", displayCelsiusTemperature); 

//----------------------- end temperature conversion ------------------------- 


    //to get 'current location' button to work: 
    let currentLocationButton = document.querySelector("#current-location-button"); 
    currentLocationButton.addEventListener("click", getCurrentLocation); 
        //then go and make 'getCurrentLocation' function (can put at end, below 'handleSubmit' function)


    //on loading the page, let's prefill the page with real-time data from a particular city (so it's not fake data saying 'TOKYO' or blank)
        //set up new function 'search(city)' (done above the handleSubmit function) 
        //so now, usually, 'handleSubmit' runs first, then that calls 'search', then that calls 'displayTemperature' 
        //but when we have the below line, it runs the 'search' function before anything else, which pre-fills the app 
    searchCity("Tokyo"); 

