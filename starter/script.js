$(document).ready(function () {
    const APIKey = "9b9930a7106df81badb54c5976f6f846";    
    
    $("#search-form").on('submit', function (event) {

        event.preventDefault();

        //TODO: endYear and startYear are optional - how to pass that onto the url in an optional way
        //without having to give it a value

        const searchCity = $(".search-button").val();
        console.log(searchCity);

        const recordsPerPage = $("#records-per-page").val();       

        const queryURL = `https://api.openweathermap.org/data/2.5/forecast? lat={lat} &lon={lon} &appid=${APIkey}`;        
        
        fetch(queryURL)
            .then(function (response) {

                //TODO:why do we turn response to json when we already receive a json object from API?
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                $("#news-goes-here").empty();
                data.response.docs.forEach(function (article) {
                    $("#news-goes-here").append(`<div><a href=${article.web_url}>${article.headline.main}</a></div>`);
                });
            }) //TODO:Do we always need a catch? We were getting error message that wasnt printing //ALWAYS CATCH PROMISES!
            .catch(function (error) {
                console.error('Error fetching data:', error);
            });
    });
});
