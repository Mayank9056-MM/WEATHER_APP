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
    forecast: forcastRes.data?.list || [],
    aqi: apiRes.data?.list?.[0] || null,
  };
};

export const fetchCoordinatesByCityName = async (cityName: string) => {
  const res = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
    params: {
      q: cityName.trim(),
      limit: 1,
      appid: WEATHER_API_KEY,
    },
  });

  if (!res.data || res.data.length === 0) {
    throw new Error(`City "${cityName}" not found`);
  }

  const { lat, lon, name, country } = res.data[0];
  return { lat, lon, name, country };
};

export const fetchCurrentLocationByIP = async () => {
  try {
    const res = await axios.get("https://ipwho.is/", { timeout: 6000 });
    if (res.data && res.data.success) {
      return {
        lat: Number(res.data.latitude),
        lon: Number(res.data.longitude),
        city: res.data.city as string,
        country: res.data.country_code as string,
      };
    }
  } catch {
    // Try secondary endpoint
    const fallback = await axios.get("http://ip-api.com/json", { timeout: 6000 });
    if (fallback.data && fallback.data.status === "success") {
      return {
        lat: Number(fallback.data.lat),
        lon: Number(fallback.data.lon),
        city: fallback.data.city as string,
        country: fallback.data.countryCode as string,
      };
    }
  }
  throw new Error("Unable to determine current location");
};