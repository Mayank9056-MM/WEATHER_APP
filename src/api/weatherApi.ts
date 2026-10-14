import axios from "axios";
import { BASE_URL, WEATHER_API_KEY } from "../utils/weatherUtils";

export const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
  const [weatherRes, forcastRes, apiRes] = await Promise.all([
    axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        units: "metric",
        appid: WEATHER_API_KEY,
      },
    }),
    axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        units: "metric",
        appid: WEATHER_API_KEY,
      },
    }),
    axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
      },
    }),
  ]);

  return {
    weather: weatherRes.data,
    forecast: forcastRes.data.list,
    airPollution: apiRes.data.list[0],
  };
};

export const fetchCoordinatesByCityName = async (cityName: string) => {
  const res = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
    params: {
      q: cityName,
      limit: 1,
      appid: WEATHER_API_KEY,
    },
  });
  
  if(res.data.length == 0){
    throw new Error("city not found");
  }

  const { coord } = res.data;
  return coord;
} 