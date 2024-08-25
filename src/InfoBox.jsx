
import './InfoBox.css';


// InfoBox component conatins all the current weather information
export default function InfoBox({info, unit, toggleUnit}){
  const temp = unit === 'C' ? info.temp : (info.temp * 9/5) + 32;
    return (
          <div className="weather-loading">
      <h2 className="city">Weather in {info.city.charAt(0).toUpperCase()+ info.city.slice(1)}</h2>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <h1 style={{display: 'inline-block'}} className="temp">{temp.toFixed(2)}° {unit}</h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

      {/* Toggle button to change Celsius into Fahrenheit and vice-versa */}
      <button onClick={toggleUnit}>
      {unit === 'C' ? 'F' : 'C'}
      </button>
      </div>
      <div className='information'>
      <div className="flex">
        <img src={`https://openweathermap.org/img/wn/${info.icon}.png`} alt="icon" class="icon" />&nbsp;&nbsp;&nbsp;
        <p className="description">{info.weatherMain}</p>
      </div>
      <p className="humidity">Humidity: {info.humidity}</p>
      <p className="wind">Wind speed: {info.windSpeed} km/h    <br />  wind direction: {info.windDirec}</p>
      <p>
      Min Temp. {info.tempMin} &nbsp;&nbsp;&nbsp;Max Temp. {info.tempMax}
    </p>
    </div>
    </div>
    )
}
