document.addEventListener('DOMContentLoaded', function () {
    const cityName = document.getElementById("cityName");
    const searchBtn = document.getElementById("searchButton");
    

    searchBtn.addEventListener('click', () => {
        console.log("Longitude:", 0);
        const city = cityName.value.trim(); // Get the city
        if(city!==''){
            const getLatLong = `https://nominatim.openstreetmap.org/search.php?q=${city}&format=jsonv2`;
            fetch(getLatLong)
                .then(response=>response.json())
                .then(data=>{
                    if(data.length > 0) {
                        const latitude = data[0].lat; // Extract latitude
                        const longitude = data[0].lon; // Extract longitude
                        const name = data[0].display_name;
                        console.log("Latitude:", latitude);
                        console.log("Longitude:", longitude);
                        const cityInfo = document.querySelector('.cityInfo');
                        const displayName = document.querySelector('.displayName');
                        displayName.innerText=name;
                        const lat = document.querySelector('.lat');
                        const long = document.querySelector('.long');
                        lat.innerText=`Latitude : ${latitude}`;
                        long.innerText=`Longitude : ${longitude}`;
                        cityInfo.appendChild(lat);
                        cityInfo.appendChild(long);
                        getWeather(latitude,longitude);
                        //         if (latitude !== '' && longitude !== '') {

                        // You can now use latitude and longitude as needed
                    } else {
                        console.log("No results found for the city:", city);
                    }
                }).catch(error => {
                    console.error("Error fetching data:", error);
            });
        }
    })
});
function findRealtimeIndex() {
    const now = new Date();
    const currentTime = now.getTime();
    const hourlyData = data.hourly;

    for (let i = 0; i < hourlyData.time.length; i++) {
        const timestamp = new Date(hourlyData.time[i]).getTime();
        if (timestamp >= currentTime) {
            return i;
        }
    }

    return hourlyData.time.length - 1; // Default to the last index if current time is not found
}

function getWeather(latitude, longitude) {
    //const realtimeIndex = findRealtimeIndex();
    const weatherDataContainer = document.querySelector(".weather"); // Define weatherDataContainer inside the function

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Clear previous data
            weatherDataContainer.innerHTML = '';
           
            // Display weather data
            const hourlyData = data.hourly;
            // i want 
            hourlyData.time.forEach((timestamp, index) => {
                const temperature = hourlyData.temperature_2m[index];
                const dateTime = new Date(timestamp);
                const formattedDate = dateTime.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                const formattedTime = dateTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                // Create a card element
                const card = document.createElement('div');
                card.classList.add('weather-card');

                // Create separate elements for date, time, and temperature
                const dateElement = document.createElement('div');
                dateElement.classList.add('date');
                dateElement.textContent = formattedDate;
                const timeElement = document.createElement('div');
                timeElement.classList.add('time');
                timeElement.textContent = formattedTime;
                const temperatureElement = document.createElement('div');
                temperatureElement.classList.add('temperature');
                temperatureElement.textContent = `${temperature}°C`;

                // Append date, time, and temperature elements to the card
                card.appendChild(dateElement);
                card.appendChild(timeElement);
                card.appendChild(temperatureElement);

                // Append the card to the weatherDataContainer
                weatherDataContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
