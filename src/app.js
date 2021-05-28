
//---------------------- Week 6 - 'Display forecast' function ---------------- 

//so just need HTML and CSS for one row of weather forecast ('day 2') and rest is repeated by JS 
//note: we need to call this function for it to work; doesn't matter where it goes so just put it at bottom of page 

//    function displayForecast() {
//        let forecastElement = document.querySelector("#forecast"); 
//        forecastElement.innerHTML = `
//        <div class="row">
//                <div class="col-6">
//                    <li class="forecast-date" id="day2-date">
//                        Tuesday 23rd March:
//                    </li>
//                </div>
//                <div class="col-1">
//                   <li class="forecast-emoji" id="day2-emoji">
//                        <i class="fas fa-cloud"></i>
//                    </li>
//                </div>
//                <div class="col-2"> 
//                    <li class="forecast-temp" id="day2-temp">
//                        24°
//                    </li>
//                </div>
//            </div>
//            `; 
//    }


//Feature #2
//Add a search engine, when searching for a city (i.e. Paris), display the city name 
// on the page after the user submits the form.


    function formatDate(timestamp) {
    
        let now = new Date(timestamp); 
    
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
    todayTime.innerHTML = `Today (${day} ${hours}:${minutes})`;

    }

    function showTemperature(response) {

        //just so we can see what we're working with: 
        console.log(response); 
        console.log(response.data.name); //this gives us the name of the city 
        console.log(response.data.main.temp); //this gives us the temperature 
        console.log(response.data.weather[0].main); //this gives us the description of the weather (e.g. sunny, clouds) 

        //now we want to change the name of the city within the h1 heading (id="city-name") 
        //can target the name of the city and call it 'cityName'... and do the rest for the other elements 
        let cityElement = document.querySelector("#city-name"); 
        let temperatureElement = document.querySelector("#temp-today");        
        let descriptionElement = document.querySelector("#description"); 
        //weather API has built-in icons: https://openweathermap.org/weather-conditions 
        //URL: http://openweathermap.org/img/wn/10d@2x.png 
        let emojiElement = document.querySelector("#emoji"); 
        
        //and now we can replace the inner HTML of each of them 
        cityElement.innerHTML = response.data.name; 
        temperatureElement.innerHTML = Math.round(response.data.main.temp);
        descriptionElement.innerHTML = response.data.weather[0].main; 
        emojiElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
        emojiElement.setAttribute("alt", response.data.weather[0].main); 
        //could be more efficient by doing 'document.querySelector("#city-name").innerHTML' etc 
            //i.e. don't need to make a new variable 'cityName' (this would save 2 lines of code per 1 element) 
            //but keeping it as is just to make it clear for me 
            //also, instead of 'response.data.name', could just used the 'cityInput' variable set below 
                //but this cleans it up as it gets the city name straight from the API

        dateToday = formatDate(response.data.dt * 1000)
    }


    function searchCity(city) {
        let apiKey = "df0e4203de8f0cf1987569b54e21756c"; 
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`; 

        axios.get(apiUrl).then(showTemperature); 
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
    
        axios.get(apiUrl).then(showTemperature); 
    } 

    function getCurrentLocation(event) {
        event.preventDefault();
        //now make new API call to get weather info for current co-ordinates 
        navigator.geolocation.getCurrentPosition(searchLocation);  
            //now make function called 'getCurrentPosition' - do this above 
    }

    let form = document.querySelector("#city-search-form"); //remember this is the ID of the form 
    form.addEventListener("submit", handleSubmit); 


    //to get 'current location' button to work: 
    let currentLocationButton = document.querySelector("#current-location-button"); 
    currentLocationButton.addEventListener("click", getCurrentLocation); 
        //then go and make 'getCurrentLocation' function (can put at end, below 'handleSubmit' function)


    //on loading the page, let's prefill the page with real-time data from a particular city (so it's not fake data saying 'TOKYO' or blank)
        //set up new function 'search(city)' (done above the handleSubmit function) 
        //so now, usually, 'handleSubmit' runs first, then that calls 'search', then that calls 'showTemperature' 
        //but when we have the below line, it runs the 'search' function before anything else, which pre-fills the app 
    searchCity("Tokyo"); 

//(see function at top)    displayForecast(); 

// Bonus point: 
// Add a Current Location button. When clicking on it, it uses the Geolocation API to get 
    // your GPS coordinates and display and the city and current temperature using the OpenWeather API.


//URL of sandbox: https://codesandbox.io/s/musing-sutherland-z5qdp?file=/src/index.js
