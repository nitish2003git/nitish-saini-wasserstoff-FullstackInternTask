import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import './SearchBox.css';

export default function SearchBox({ updateInfo, updateForecast }) {
    // city as a state variable to track the weather of city
    let [city, setCity] = useState("");
    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
    const API_KEY = "ADD YOUR OWN OpenWeather api KEY";


    // getWeatherInfo() Function fetch openweather api to receive current weather
    let getWeatherInfo = async () => {
        let response = await fetch(
            `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) {
            alert("No weather found.");
            throw new Error("No weather found.");
          }else{
        let jsonResponse = await response.json();
        console.log(jsonResponse);
        let result = {
            city: city,
            temp: jsonResponse.main.temp,
            tempMin: jsonResponse.main.temp_min,
            tempMax: jsonResponse.main.temp_max,
            humidity: jsonResponse.main.humidity,
            weather: jsonResponse.weather[0].description,
            weatherMain: jsonResponse.weather[0].main, 
            icon: jsonResponse.weather[0].icon,
            windSpeed: jsonResponse.wind.speed,
            windDirec: jsonResponse.wind.deg,
        };
        console.log(result);
        return result;
    }
    };


    // getForecastInfo() Function fetch openweather api to get data for upcoming days
    let getForecastInfo = async () => {
        let response = await fetch(
            `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`
        );
        let jsonResponse = await response.json();
        console.log(jsonResponse);
        let forecast = getDailyForecast(jsonResponse.list);
        return forecast;
    };

    // getDailyForecast() function filter out the data received from getForecastInfo() function for next 5 days weather
    const getDailyForecast = (list) => {
        const dailyForecast = [];
        const today = new Date().getDate();
    
        list.forEach((item) => {
            const date = new Date(item.dt_txt);
            const day = date.getDate();
    
            // Ensure we're getting forecasts for different days and not more than one per day
            if (day !== today && dailyForecast.length < 5 && !dailyForecast.some(f => new Date(f.date).getDate() === day)) {
                dailyForecast.push({
                    date: item.dt_txt,
                    temp: item.main.temp,
                    weather: item.weather[0].main,
                    description: item.weather[0].description,
                    icon: item.weather[0].icon,
                });
            }
        });
    
        // Ensure we have exactly 5 days of forecast, if there's a day missing add from the available data
        while (dailyForecast.length < 5 && list.length > 0) {
            const item = list[dailyForecast.length];
            dailyForecast.push({
                date: item.dt_txt,
                temp: item.main.temp,
                weather: item.weather[0].main,
                description: item.weather[0].description,
                icon: item.weather[0].icon,
            });
        }
        console.log(dailyForecast);
        return dailyForecast;
    };
    

    let handleChange = (event) => {
        setCity(event.target.value);
    };

    let handleSubmit = async (event) => {
        event.preventDefault();
        console.log(city);
        setCity("");
        let newInfo = await getWeatherInfo();
        let newForecast = await getForecastInfo();
        updateInfo(newInfo);
        updateForecast(newForecast);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input required value={city} onChange={handleChange} />
                <IconButton id="searchparent" aria-label="search" type="submit">
                    <SearchIcon id="search"/>
                </IconButton>
            </form>
        </div>
    );
}
