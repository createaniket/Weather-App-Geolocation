import React, { useState, useEffect } from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";
import { saveShareData } from './images/Apicall';

// Helper function to format the date
const dateBuilder = (d) => {
  const months = [
    "January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October",
    "November", "December"
  ];
  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

// Default configuration for the weather icon
const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

const Weather = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [weather, setWeather] = useState(null);
  const [icon, setIcon] = useState("CLEAR_DAY");

  // Function to get the user's location
  const getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  // Function to fetch weather data and save share data
  const getWeather = async (lat, lon) => {
    try {
      // Collect device and network info
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const viewportSize = `${window.innerWidth}x${window.innerHeight}`;
      const connection =
        navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const networkInfo = connection
        ? { effectiveType: connection.effectiveType, downlink: connection.downlink }
        : {};

      // Save share data (custom API call)
      await saveShareData(lat, lon, viewportSize, screenResolution, networkInfo);

      // Fetch weather data from API
      const api_call = await fetch(
        `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
      );
      const data = await api_call.json();

      // Update weather state
      setWeather({
        city: data.name,
        country: data.sys.country,
        temperatureC: Math.round(data.main.temp),
        main: data.weather[0].main,
      });

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
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Get the user's location and fetch weather data on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      getPosition()
        .then((position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
        })
        .catch((err) => {
          console.error("Error getting location:", err);
          // Fallback to default location if user denies geolocation
          setLocation({ lat: 28.67, lon: 77.22 });
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating real-time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }
  }, []);

  // Fetch weather when location changes
  useEffect(() => {
    if (location.lat && location.lon) {
      getWeather(location.lat, location.lon);
    }
  }, [location]);

  // Render the weather information
  if (weather) {
    return (
      <React.Fragment>
        <div className="city">
          <div className="title">
            <h2>{weather.city}</h2>
            <h3>{weather.country}</h3>
          </div>
          <div className="mb-icon">
            <ReactAnimatedWeather
              icon={icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
            <p>{weather.main}</p>
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
                {weather.temperatureC}°<span>C</span>
              </p>
            </div>
          </div>
        </div>
        <Forcast icon={icon} weather={weather.main} />
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
