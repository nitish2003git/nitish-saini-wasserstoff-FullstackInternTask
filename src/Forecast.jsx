import React from 'react';
import './Forecast.css';

// Forecast component contains the information for next five days weather
export default function Forecast({ forecast, unit }) {
    return (
        <div className="forecast">
            <h2>5-Day Forecast</h2>
            <div className="forecast-cards">
                {forecast.map((day, index) => (
                    <div key={index} className="forecast-card">
                        <p>{new Date(day.date).toLocaleDateString()}</p>
                        <p>{(unit === 'C' ? day.temp : (day.temp * 9/5) + 32).toFixed(2)}° {unit}</p>
                        <p>{day.weather}</p>
                        <img
                            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                            alt="forecast icon"
                            className="icon"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
