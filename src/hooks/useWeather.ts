import { AQIData, ForecastData, WeatherData } from "@/types/weather";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  fetchCoordinatesByCityName,
  fetchCurrentLocationByIP,
  fetchWeatherByCoordinates,
} from "@/api/weatherApi";

// Check if the native ExpoLocation binary module is present without triggering require() errors
const isExpoLocationAvailable = (): boolean => {
  try {
    const globalExpo = (globalThis as any).expo;
    if (globalExpo?.modules?.ExpoLocation) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { requireOptionalNativeModule } = require("expo-modules-core");
    if (typeof requireOptionalNativeModule === "function") {
      const nativeMod = requireOptionalNativeModule("ExpoLocation");
      return !!nativeMod;
    }
  } catch {
    // Suppress detection errors
  }
  return false;
};

export const useWeather = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [api, setApi] = useState<AQIData | null>(null);
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lon: number } | null>(null);

  const loadWeatherData = async (lat: number, lon: number, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMsg("");

    try {
      const data = await fetchWeatherByCoordinates(lat, lon);
      setWeather(data.weather);
      setForecast(data.forecast);
      setApi(data.aqi);
      setActiveCoords({ lat, lon });
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || error.message || "Error fetching weather data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchIPLocationWeather = async () => {
    setLoading(true);
    try {
      const ipLoc = await fetchCurrentLocationByIP();
      await loadWeatherData(ipLoc.lat, ipLoc.lon);
    } catch {
      // Fallback to default if network IP resolution fails
      await loadWeatherData(51.5074, -0.1278);
      setErrorMsg("Could not detect current location. Showing default city.");
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      // If native ExpoLocation module is available, request OS permission dialog
      if (isExpoLocationAvailable()) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Location = require("expo-location");

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy?.Balanced,
          });
          await loadWeatherData(loc.coords.latitude, loc.coords.longitude);
          return;
        } else {
          // Permission denied by user in OS dialog
          setErrorMsg("Location permission was denied. You can search any city above.");
          await loadWeatherData(51.5074, -0.1278);
          return;
        }
      }

      // If native ExpoLocation is not compiled in the current app binary (e.g. unlinked dev-client),
      // prompt the user explicitly with an in-app permission dialog
      Alert.alert(
        "Location Access",
        "Allow Weather App to access your current location to show live weather conditions for where you are?",
        [
          {
            text: "Not Now",
            style: "cancel",
            onPress: async () => {
              await loadWeatherData(51.5074, -0.1278);
            },
          },
          {
            text: "Allow",
            onPress: async () => {
              await fetchIPLocationWeather();
            },
          },
        ]
      );
    } catch {
      await loadWeatherData(51.5074, -0.1278);
    } finally {
      setLoading(false);
    }
  };

  const searchCity = async (cityName: string) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const { lat, lon } = await fetchCoordinatesByCityName(cityName);
      await loadWeatherData(lat, lon);
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || error.message || "Error fetching city data");
      setLoading(false);
    }
  };

  const refreshWeather = async () => {
    if (activeCoords) {
      await loadWeatherData(activeCoords.lat, activeCoords.lon, true);
    } else {
      await getLocationWeather();
    }
  };

  const clearError = () => {
    setErrorMsg("");
  };

  useEffect(() => {
    getLocationWeather();
  }, []);

  return {
    loading,
    refreshing,
    errorMsg,
    weather,
    forecast,
    api,
    getLocationWeather,
    searchCity,
    refreshWeather,
    clearError,
  };
};
