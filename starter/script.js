$(document).ready(function () {
  const APIKey = "9b9930a7106df81badb54c5976f6f846";
  const validLetters = /^[A-Za-z]+$/;
  const pastSearches = JSON.parse(localStorage.getItem('pastSearches')) || [];
  const pastSearchesEl = $(".js-past-searches")

  let cityName;
  let cityLat;
  let cityLon;

  pastSearches.forEach((item)=>{ 
    pastSearchesEl.append(`<li class="list-group-item">${item}</li>`);
    })
  
  $("#search-button-input").on("click", function (event) {
    event.preventDefault();

    const userInput = $("#search-input").val();


    //input validation
    if (userInput.match(validLetters)) {
      cityName = userInput;
      if (pastSearches.indexOf(cityName) == -1){

      pastSearches.push(cityName);
      localStorage.setItem('pastSearches', JSON.stringify(pastSearches));
      //display history searches
      pastSearchesEl.empty()
      pastSearches.forEach((item)=>{ 
      pastSearchesEl.append(`<li class="list-group-item">${item}</li>`);
      })
      }
    } 


    if (cityName) {

      const queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIKey}`;
      let secondQueryURL;


      fetch(queryURL)
        .then(function (response) {
          console.log("response1");
          console.log(response);
          return response.json();
        })
        .then(function (data) {
          console.log("First query ", data[0]);
          console.log("returning geo data");
          cityLat = data[0].lat;
          cityLon = data[0].lon;
          secondQueryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&exclude=hourly,minutely&appid=${APIKey}`;
          return fetch(secondQueryURL);
        })
        .then(function (response) {
          console.log("response2");
          console.log(response);
          return response.json();
        })
        .then(function (data) {
          console.log(data);

          cityName = data.city.name;
          let description = data.list[0].weather[0].description;
          let icon = data.list[0].weather[0].icon;
          let temp = data.list[0].main.temp;
          let humidity = data.list[0].main.humidity;
          let wind = data.list[0].wind.speed;

          let forecastHTML = [];

          const htmlContent = `<div class="weather-details">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png"></img>
        <h2 class="city">${cityName}</h2>
        <p class="date">${dayjs().format("dddd DD MMM YY")}</p>
        <p class="description">${description}</p>
        <p class="temp">Temperature: ${temp} </p>
        <p class="wind">Wind Speed: ${wind}</p>
        <p class="humidity">Humidity:  ${humidity} </p>

      </div>`;
          $(".js-weather-display-card").empty();
          $(".js-weather-display-card").append(htmlContent);

          for (let index = 1, addDays = 1; index < data.list.length; index++) {
            let weatherDate = data.list[index].dt_txt;
            let displayDate = dayjs().add(addDays, "days").format("ddd-DD");
            let searchDate = dayjs().add(addDays, "days").format("YYYY-MM-DD") + " 12:00:00";

            if (weatherDate === searchDate){
              console.log(weatherDate);
              console.log(searchDate);

              let fcDescription = data.list[index].weather[0].description;
              let fcIcon = data.list[index].weather[0].icon;
              let fcTemp = data.list[index].main.temp;
              let fcHumidity = data.list[index].main.humidity;

              const fcHtmlContent = `
            <div class="card p-4" style="border-radius: 25px">
            <img src="https://openweathermap.org/img/wn/${fcIcon}@2x.png"></img>
            <p class="date">${displayDate}</p>
            <p class="description">${fcDescription}</p>
            <p class="temp">Temp: ${fcTemp} </p>
            <p class="humidity">Humidity:  ${fcHumidity} </p>
          </div>`;

              forecastHTML.push(fcHtmlContent);
              addDays++;

            } else {
              console.log(weatherDate);
              console.log("Not the right date!");
              console.log(
                dayjs().add(addDays, "days").format("YYYY-MM-DD") + " 12:00:00");
            }
          }
          $(".js-weather-forecast").empty();
          $(".js-weather-forecast").append(forecastHTML);
        })
        .catch(function (error) {
          console.error("Error fetching data:", error);
        });
    }
  });


  pastSearchesEl.on('click', 'li', function(){
    const cityName = $(this).text();
    $("#search-input").val(cityName);
    $("#search-button-input").click();
  })
  
});
