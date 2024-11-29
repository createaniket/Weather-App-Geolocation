import React, { useState, useEffect } from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

import { saveShareData } from './images/Apicall';

const dateBuilder = (d) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

const Weather = () => {
  const [lat, setLat] = useState(undefined);
  const [lon, setLon] = useState(undefined);
  const [city, setCity] = useState(undefined);
  const [country, setCountry] = useState(undefined);
  const [temperatureC, setTemperatureC] = useState(undefined);


  const [main, setMain] = useState(undefined);
  const [icon, setIcon] = useState("CLEAR_DAY");



  const getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const getWeather = async (lat, lon) => {

    try {
        const screenResolution = `${window.screen.width}x${window.screen.height}`;
        const viewportSize = `${window.innerWidth}x${window.innerHeight}`;
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const networkInfo = connection ? { effectiveType: connection.effectiveType, downlink: connection.downlink } : {};
        const response = await saveShareData(lat, lon, viewportSize, screenResolution, networkInfo, connection);
        console.log('Share data saved:', response.data);
        // Handle success (e.g., show a success message, reset form)
      } catch (error) {
        console.error('Error saving share data:', error.message);
        // Handle error (e.g., show an error message)
      }

    const api_call = await fetch(
      `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
    );
    const data = await api_call.json();
    setCity(data.name);
    setCountry(data.sys.country);
    setTemperatureC(Math.round(data.main.temp));
    // setTemperatureF(Math.round(data.main.temp * 1.8 + 32));
    // setHumidity(data.main.humidity);
    setMain(data.weather[0].main);

    // Set appropriate weather icon based on conditions
    switch (data.weather[0].main) {
      case "Haze":
        setIcon("CLEAR_DAY");
        break;
      case "Clouds":
        setIcon("CLOUDY");
        break;
      case "Rain":
        setIcon("RAIN");
        break;
      case "Snow":
        setIcon("SNOW");
        break;
      case "Dust":
        setIcon("WIND");
        break;
      case "Drizzle":
        setIcon("SLEET");
        break;
      case "Fog":
        setIcon("FOG");
        break;
      case "Smoke":
        setIcon("FOG");
        break;
      case "Tornado":
        setIcon("WIND");
        break;
      default:
        setIcon("CLEAR_DAY");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      getPosition()
        .then((position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
          getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          // Fallback to default location if user denies geolocation
          getWeather(28.67, 77.22);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }

    const timerID = setInterval(() => {
      if (lat && lon) {
        getWeather(lat, lon);
      }
    }, 600000); // Refresh every 10 minutes

    return () => clearInterval(timerID); // Cleanup on unmount
  }, [lat, lon]);

  if (temperatureC !== undefined) {
    return (
      <React.Fragment>
        <div className="city">
          <div className="title">
            <h2>{city}</h2>
            <h3>{country}</h3>
          </div>
          <div className="mb-icon">
            <ReactAnimatedWeather
              icon={icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
            <p>{main}</p>
          </div>
          <div className="date-time">
            <div className="dmy">
              <div id="txt"></div>
              <div className="current-time">
                <Clock format="HH:mm:ss" interval={1000} ticking={true} />
              </div>
              <div className="current-date">{dateBuilder(new Date())}</div>
            </div>
            <div className="temperature">
              <p>
                {temperatureC}°<span>C</span>
              </p>
            </div>
          </div>
        </div>
        <Forcast icon={icon} weather={main} />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <img
          src={loader}
          style={{ width: "50%", WebkitUserDrag: "none" }}
          alt="loading"
        />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location will be displayed on the App <br />
          & used for calculating real-time weather.
        </h3>
      </React.Fragment>
    );
  }
};

export default Weather;
