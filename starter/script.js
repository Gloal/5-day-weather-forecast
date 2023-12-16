$(document).ready(function () {
  const APIKey = "9b9930a7106df81badb54c5976f6f846";

  $("#search-button-input").on("click", function (event) {
    event.preventDefault();
    console.log( event);

   // const cityName = $("#search-input").val();
    const cityName = "london";
    console.log("CityName: " +cityName);
    
    const queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIKey}`;
    let secondQueryURL;

    fetch(queryURL)
      .then (function (response) {
        console.log("response1");
        console.log(response);
        return response.json();
      })
      .then (function (data){
        console.log("data1");
        console.log(data[0]);
        console.log("returning geo data");
        console.log("data.lat " + data[0].lat);
        console.log("data.lon " + data[0].lon);
        secondQueryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${APIKey}`
        return fetch(secondQueryURL)
      })
      .then (function (response){
        console.log("response2");
        console.log(response);
        return response.json();
      })
      .then(function (data){
        console.log("data2");
        console.log(data);
        console.log("city:" +data.city.name  )      
        console.log("desciption:" +data.list[0].weather[0].description )      
        const htmlContent = `<div class="weather-details">
        <h2 class="city">${data.city.name}</h2>
        <p class="date">Today's Date</p>
        <p class="description">${data.list[0].weather[0].description}</p>
        <p class="temp">Temperature: ${data.list[0].main.temp} </p>
        <p class="wind">Wind: ${data.list[0].weather[0].description}</p>
        <p class="humidity">Humidity:  ${data.list[0].main.humidity} </p>
      </div>`
      $(".js-weather-display-card").empty();
      $(".js-weather-display-card").append(htmlContent);
    })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });

    });
});