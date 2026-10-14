import { AQIData, ForecastData, WeatherData } from "@/types/weather";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { fetchCoordinatesByCityName, fetchWeatherByCoordinates } from "@/api/weatherApi";

export const useWeather = () => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [api, setApi] = useState<AQIData | null>(null);

  const getLocationWeather = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permisson to access location was denied");
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      await loadWeatherData(loc.coords.latitude, loc.coords.longitude);
    } catch (error: any) {
      setErrorMsg(error.message || "Error fetching location");
      setLoading(false);
    }
  };

  const loadWeatherData = async (lat: number, lon: number) => {
    try {
      const data = await fetchWeatherByCoordinates(lat, lon);

      setWeather(data.weather);
      setForecast(data.forecast);
      setApi(data.aqi);
      setLoading(false);
    } catch (error: any) {
      setErrorMsg(error.message || "Error fetching weather data");
      setLoading(false);
    }
  };

  const searchCity = async (cityName: string) => {
    setLoading(true);
    setErrorMsg("");

    try{
        const {lan, lon} = await fetchCoordinatesByCityName(cityName);
        await loadWeatherData(lan,lon);

    }catch(error: any){
        setErrorMsg(error.message || "Error fetching city data");
        setLoading(false);
    }
  };

  useEffect(() => {
    getLocationWeather();
  }, []);

  return {
    loading,
    errorMsg,
    weather,
    forecast,
    api,
    getLocationWeather,
    searchCity,
  }
};
