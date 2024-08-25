import SearchBox from './SearchBox';
import InfoBox from './InfoBox';
import Forecast from './Forecast';
import { useState, useEffect } from 'react';
import './WeatherApp.css';



export default function WeatherApp() {
    const [weatherInfo, setWeatherInfo] = useState({
        city: "Delhi",
        feelsLike: 24.84,
        temp: 25.05,
        tempMin: 25.05,
        tempMax: 25.05,
        humidity: 47,
        weather: "haze",
        weatherMain: "Clouds",
    });

    // 'forecast' and 'unit' as a state variable to track weather forecast and weather measuring unit
    const [forecast, setForecast] = useState([]);
    const [unit, setUnit] = useState('C');
    const API_KEY = "ADD YOUR OWN OpenWeather API KEY";
    const defaultCity = "Delhi";


    useEffect(() => {
        // fetchWeather() Function fetch openweather api to receive current weather
        const fetchWeather = async (lat, lon, city) => {
            try {
                const currentWeatherUrl = lat && lon 
                    ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric` 
                    : `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

                const forecastUrl = lat && lon 
                    ? `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric` 
                    : `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

                const currentWeatherResponse = await fetch(currentWeatherUrl);
                const forecastResponse = await fetch(forecastUrl);

                const currentWeatherData = await currentWeatherResponse.json();
                const forecastData = await forecastResponse.json();

                setWeatherInfo({
                    city: city || currentWeatherData.name,
                    temp: currentWeatherData.main.temp,
                    tempMin: currentWeatherData.main.temp_min,
                    tempMax: currentWeatherData.main.temp_max,
                    humidity: currentWeatherData.main.humidity,
                    weather: currentWeatherData.weather[0].description,
                    weatherMain: currentWeatherData.weather[0].main,
                    icon: currentWeatherData.weather[0].icon,
                    windSpeed: currentWeatherData.wind.speed,
                    windDirec: currentWeatherData.wind.deg,
                });
                setForecast(getDailyForecast(forecastData.list));
                updateBackgroundVideo(currentWeatherData.weather[0].main);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };


    // getLocation() function ask user to get access to their location and if user denied then weather of default city 'Delhi' will be displayed
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchWeather(latitude, longitude);
                    },
                    (error) => {
                        console.warn(`Geolocation error (${error.code}): ${error.message}`);
                        fetchWeather(null, null, defaultCity);
                    }
                );
            } else {
                fetchWeather(null, null, defaultCity);
            }
        };

        getLocation();
    }, []);

 // getDailyForecast() function filter out the data received from fetchWeather() function for next 5 days weather
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
    
        return dailyForecast;
    };
    

    let updateInfo = (newInfo) => {
        setWeatherInfo(newInfo);
    };

    let updateForecast = (newForecast) => {
        setForecast(newForecast);
    };

        // Function to toggle temperature unit
        const toggleUnit = () => {
            setUnit((prevUnit) => (prevUnit === 'C' ? 'F' : 'C'));
        };
    

    return (
        <div className="weather-container">            
            <div className='current-weather'>
            
            <h2 style={{fontSize: "2em"}}>SkyScene</h2>
            <br />
            <SearchBox updateInfo={updateInfo} updateForecast={updateForecast} />
            <InfoBox info={weatherInfo}  unit={unit} toggleUnit={toggleUnit}/>
            </div>
            <Forecast  forecast={forecast} unit={unit}/>
        </div>
    );
}
