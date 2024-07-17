import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [data, setData] = useState({})
  const [location, setLocation] = useState('')
  const [forecast, setForecast] = useState([])

  const fetchWeatherData = async (lat, lon) => {
    const apiKey = '895284fb2d2c50a520ea537456963d9c'
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${apiKey}`

    try {
      const weatherResponse = await axios.get(weatherUrl)
      const forecastResponse = await axios.get(forecastUrl)
      setData(weatherResponse.data)
      setForecast(forecastResponse.data.daily)
      console.log(weatherResponse.data)
      console.log(forecastResponse.data.daily)
    } catch (error) {
      console.error('Error fetching weather data:', error)
    }
  }

  const searchLocation = async (event) => {
    if (event.key === 'Enter') {
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=895284fb2d2c50a520ea537456963d9c`
      try {
        const response = await axios.get(geocodeUrl)
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0]
          fetchWeatherData(lat, lon)
        }
      } catch (error) {
        console.error('Error fetching location data:', error)
      }
      setLocation('')
    }
  }

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text" />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name !== undefined &&
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°F</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        }

        {forecast.length > 0 &&
          <div className="forecast">
            <h2>7-Day Forecast</h2>
            <table className="forecast-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Temperature</th>
                  <th>Weather</th>
                </tr>
              </thead>
              <tbody>
                {forecast.map((day, index) => (
                  <tr key={index}>
                    <td>{new Date(day.dt * 1000).toLocaleDateString()}</td>
                    <td>{day.temp.day.toFixed()}°F</td>
                    <td>{day.weather[0].main}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
